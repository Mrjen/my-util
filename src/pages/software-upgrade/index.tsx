import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFirmwareUpgrade } from "./use-firmware-upgrade"
import { STATUS_MESSAGES, type UpgradeStatus } from "./firmware-utils"
import md5 from "md5"

export default function SoftwareUpgrade() {
  const {
    devices,
    selectedDeviceIndex,
    isInIAPMode,
    status,
    progress,
    logs,
    error,
    connectDevice,
    disconnectDevice,
    selectDevice,
    enterIAPMode,
    uploadFirmware,
    clearLogs,
  } = useFirmwareUpgrade()

  const selectedDevice = selectedDeviceIndex >= 0 ? devices[selectedDeviceIndex] : null

  const [firmwareFile, setFirmwareFile] = useState<File | null>(null)
  const [firmwareData, setFirmwareData] = useState<Uint8Array | null>(null)
  const [firmwareMd5, setFirmwareMd5] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFirmwareFile(file)

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    setFirmwareData(uint8Array)

    // 将二进制数据转换为十六进制字符串（参考用户的 hexView 逻辑）
    let hexString = ""
    for (const byteValue of uint8Array) {
      if (hexString) hexString += " "
      hexString += `00${byteValue.toString(16)}`.slice(-2).toUpperCase()
    }

    // 对十六进制字符串计算 MD5
    const hash = md5(hexString)
    setFirmwareMd5(hash.toUpperCase())
  }

  const handleEnterIAPMode = async () => {
    await enterIAPMode()
  }

  const handleUploadFirmware = async () => {
    if (!firmwareData) return
    await uploadFirmware(firmwareData)
  }

  const isUpgrading = !["idle", "success", "error"].includes(status)

  const canEnterIAP = selectedDevice && !isUpgrading && !isInIAPMode
  const canUpload = selectedDevice && firmwareData && !isUpgrading && isInIAPMode

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">固件升级</h1>

      {/* 设备连接区域 */}
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="font-semibold">1. 连接设备</h2>
        <div className="flex items-center gap-4">
          {devices.length === 0 ? (
            <Button onClick={connectDevice}>连接 HID 设备</Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">
                  已连接: {selectedDevice?.productName || "未知设备"} (VID:{" "}
                  {selectedDevice?.vendorId.toString(16).toUpperCase().padStart(4, "0")}, PID:{" "}
                  {selectedDevice?.productId.toString(16).toUpperCase().padStart(4, "0")})
                </span>
              </div>
              <Button variant="destructive" size="sm" onClick={disconnectDevice}>
                断开
              </Button>
            </>
          )}
        </div>

        {/* 设备接口选择 */}
        {devices.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">选择设备接口：</label>
            <Select
              value={selectedDeviceIndex.toString()}
              onValueChange={(value) => selectDevice(parseInt(value, 10))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="选择设备接口" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((dev, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    接口 {index}: {dev.collections.length} 个 collection
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* 固件选择区域 */}
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="font-semibold">2. 选择固件文件</h2>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".bin,.hex"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            选择文件
          </Button>
          {firmwareFile && (
            <span className="text-sm text-muted-foreground">
              {firmwareFile.name} ({(firmwareFile.size / 1024).toFixed(2)} KB)
            </span>
          )}
        </div>
        {firmwareMd5 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">MD5:</span>
              <code className="font-mono text-xs">{firmwareMd5}</code>
            </div>
          </div>
        )}
      </div>

      {/* 升级操作区域 */}
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="font-semibold">3. 升级操作</h2>

        {/* IAP 模式状态提示 */}
        {isInIAPMode && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
            <p className="text-yellow-800 dark:text-yellow-200">
              设备已进入 IAP 模式，请重新连接设备后点击「写入固件」
            </p>
          </div>
        )}

        <div className="flex gap-4">
          {/* 步骤 1: 进入 IAP 模式 */}
          <div className="space-y-2">
            <Button onClick={handleEnterIAPMode} disabled={!canEnterIAP} variant="outline">
              {status === "entering_upgrade_mode" || status === "entering_iap_mode"
                ? "进入中..."
                : "进入 IAP 模式"}
            </Button>
            <p className="text-xs text-muted-foreground">设备会断开重连</p>
          </div>

          {/* 步骤 2: 写入固件 */}
          <div className="space-y-2">
            <Button onClick={handleUploadFirmware} disabled={!canUpload}>
              {status === "sending_firmware" || status === "finishing"
                ? "写入中..."
                : "写入固件"}
            </Button>
            <p className="text-xs text-muted-foreground">需先进入 IAP 模式</p>
          </div>
        </div>

        {/* 状态显示 */}
        {status !== "idle" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusIndicator status={status} />
              <span className="text-sm">{STATUS_MESSAGES[status]}</span>
            </div>

            {/* 进度条 */}
            {status === "sending_firmware" && (
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            )}
          </div>
        )}

        {/* 错误显示 */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* 日志区域 */}
      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">日志</h2>
          <Button variant="ghost" size="sm" onClick={clearLogs}>
            清除
          </Button>
        </div>
        <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded p-3 font-mono text-xs space-y-1">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">暂无日志</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={getLogClassName(log.type)}>
                <span className="text-muted-foreground">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>{" "}
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatusIndicator({ status }: { status: UpgradeStatus }) {
  if (status === "success") {
    return <span className="w-2 h-2 bg-green-500 rounded-full" />
  }
  if (status === "error") {
    return <span className="w-2 h-2 bg-red-500 rounded-full" />
  }
  return <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
}

function getLogClassName(type: "info" | "error" | "warn" | "success"): string {
  switch (type) {
    case "error":
      return "text-red-600"
    case "warn":
      return "text-yellow-600"
    case "success":
      return "text-green-600"
    default:
      return "text-gray-700 dark:text-gray-300"
  }
}
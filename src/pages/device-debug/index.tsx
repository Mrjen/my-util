import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as commands from "./k12/k12_commond"
import { LIGHT_BINDING_COMMANDS, buildLightBindingCommand } from "./k12/k12_commond"
import { crc16GetValue } from "./utils/crc16"

const commandOptions = [
  { label: "将第1个按键改为A键", value: "set_1_to_a" },
  { label: "将第15个按键改为A键", value: "set_15_to_a" },
  { label: "将第16个按键改为A键", value: "set_16_to_a" },
  { label: "将第61个按键改为A键", value: "set_61_to_a" },
  { label: "重置键盘布局", value: "reset_keyboard_layout" },
  { label: "重置 FN1 层键盘布局", value: "reset_fn1_keyboard_layout" },
  { label: "恢复出厂设置", value: "factory_reset" },
  { label: "重置所有键程数据", value: "reset_all_key_travel" },
  { label: "绑定 R1 灯光", value: "light_binding_r1" },
  { label: "绑定 R2 灯光", value: "light_binding_r2" },
  { label: "绑定 R3 灯光", value: "light_binding_r3" },
] as const

type CommandKey = (typeof commandOptions)[number]["value"]

function isLightBindingCommand(cmd: string): boolean {
  return (LIGHT_BINDING_COMMANDS as readonly string[]).includes(cmd)
}

function parseLightValue(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  let value: number
  if (trimmed.toLowerCase().startsWith("0x")) {
    value = parseInt(trimmed, 16)
  } else {
    value = parseInt(trimmed, 10)
  }

  if (Number.isNaN(value) || value < 0 || value > 255) {
    return null
  }
  return value
}

interface ReportInfo {
  reportId: number
  type: "input" | "output" | "feature"
}

function parseHexString(hexString: string, length = 64): Uint8Array {
  const hexValues = hexString.split(",").map((s) => s.trim())
  const bytes = hexValues.map((hex) => parseInt(hex, 16))
  const view = new Uint8Array(length)
  view.set(bytes) // 剩余位置自动填充 0
  return view
}

function getDeviceReports(device: HIDDevice): ReportInfo[] {
  const reports: ReportInfo[] = []
  for (const collection of device.collections) {
    for (const outputReport of collection.outputReports ?? []) {
      reports.push({ reportId: outputReport.reportId ?? 0, type: "output" })
    }
    for (const featureReport of collection.featureReports ?? []) {
      reports.push({ reportId: featureReport.reportId ?? 0, type: "feature" })
    }
  }
  return reports
}

export default function DeviceDebug() {
  const [devices, setDevices] = useState<HIDDevice[]>([])
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(-1)
  const [selectedReport, setSelectedReport] = useState<ReportInfo>({ reportId: 0, type: "output" })
  const [error, setError] = useState<string>("")
  const [selectedCommand, setSelectedCommand] = useState<CommandKey | "">("")
  const [sending, setSending] = useState(false)
  const [lightValue, setLightValue] = useState<string>("")

  const needsLightInput = Boolean(selectedCommand && isLightBindingCommand(selectedCommand))
  const parsedLightValue = lightValue ? parseLightValue(lightValue) : null
  const lightValueError =
    needsLightInput && lightValue && parsedLightValue === null
      ? "请输入有效的灯光数值 (0-255 或 0x00-0xFF)"
      : ""

  const selectedDevice = selectedDeviceIndex >= 0 ? devices[selectedDeviceIndex] : null
  const availableReports = selectedDevice ? getDeviceReports(selectedDevice) : []

  const handleConnect = async () => {
    try {
      setError("")
      const requestedDevices = await navigator.hid.requestDevice({
        filters: [], // 允许选择任意 HID 设备
      })

      if (requestedDevices.length > 0) {
        // 打开所有设备
        for (const dev of requestedDevices) {
          if (!dev.opened) {
            await dev.open()
          }
        }
        setDevices(requestedDevices)
        setSelectedDeviceIndex(0)
        // 设置默认 report
        const reports = getDeviceReports(requestedDevices[0])
        if (reports.length > 0) {
          setSelectedReport(reports[0])
        }
        console.log("可用设备列表:", requestedDevices)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const handleDisconnect = async () => {
    for (const dev of devices) {
      if (dev.opened) {
        await dev.close()
      }
    }
    setDevices([])
    setSelectedDeviceIndex(-1)
    setSelectedReport({ reportId: 0, type: "output" })
  }

  const handleDeviceChange = (value: string) => {
    const index = parseInt(value, 10)
    setSelectedDeviceIndex(index)
    // 更新 report 选项
    const reports = getDeviceReports(devices[index])
    if (reports.length > 0) {
      setSelectedReport(reports[0])
    } else {
      setSelectedReport({ reportId: 0, type: "output" })
    }
  }

  const handleSendCommand = async () => {
    if (!selectedDevice || !selectedCommand) return

    // 对于灯光绑定指令，验证输入
    if (isLightBindingCommand(selectedCommand)) {
      if (parsedLightValue === null) {
        setError("请输入有效的灯光数值")
        return
      }
    }

    try {
      setSending(true)
      setError("")

      let data: Uint8Array

      if (isLightBindingCommand(selectedCommand) && parsedLightValue !== null) {
        // 动态构建灯光绑定指令
        const commandBytes = buildLightBindingCommand(selectedCommand, parsedLightValue)
        const [crcHigh, crcLow] = crc16GetValue(commandBytes, commandBytes.length)
        const fullCommand = [...commandBytes, parseInt(crcHigh, 16), parseInt(crcLow, 16)]

        data = new Uint8Array(64)
        data.set(fullCommand)

        console.log(
          "构建灯光绑定指令:",
          fullCommand.map((b) => `0x${b.toString(16).toUpperCase().padStart(2, "0")}`).join(", "),
        )
      } else {
        // 使用预定义的静态指令
        const commandString = commands[selectedCommand as keyof typeof commands] as string
        data = parseHexString(commandString)
      }

      // 根据 report 类型调用不同的方法
      if (selectedReport.type === "feature") {
        console.log(
          "发送特征报告:",
          selectedReport.reportId,
          Array.from(data)
            .map((b) => `0x${b.toString(16).toUpperCase().padStart(2, "0")}`)
            .join(", "),
        )
        await selectedDevice.sendFeatureReport(selectedReport.reportId, data)
      } else {
        await selectedDevice.sendReport(selectedReport.reportId, data)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">设备调试</h1>

      <div className="flex gap-2">
        {devices.length === 0 ? (
          <Button onClick={handleConnect}>连接设备</Button>
        ) : (
          <Button variant="destructive" onClick={handleDisconnect}>
            断开连接
          </Button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {devices.length > 0 && (
        <div className="p-4 border rounded-lg space-y-4">
          <div className="space-y-2">
            <h2 className="font-semibold">选择设备</h2>
            <Select
              value={selectedDeviceIndex >= 0 ? selectedDeviceIndex.toString() : ""}
              onValueChange={handleDeviceChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择设备" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((dev, index) => (
                  <SelectItem
                    key={`${dev.vendorId}-${dev.productId}-${index}`}
                    value={index.toString()}
                  >
                    {dev.productName || "未知设备"} (VID:{" "}
                    {dev.vendorId.toString(16).toUpperCase().padStart(4, "0")}, PID:{" "}
                    {dev.productId.toString(16).toUpperCase().padStart(4, "0")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDevice && (
            <>
              <div className="space-y-2">
                <h2 className="font-semibold">已选设备信息</h2>
                <p>名称: {selectedDevice.productName || "未知"}</p>
                <p>
                  厂商 ID: {selectedDevice.vendorId.toString(16).toUpperCase().padStart(4, "0")}
                </p>
                <p>
                  产品 ID: {selectedDevice.productId.toString(16).toUpperCase().padStart(4, "0")}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-semibold">选择 Report</h2>
                <Select
                  value={`${selectedReport.reportId}-${selectedReport.type}`}
                  onValueChange={(value: string) => {
                    const [reportId, type] = value.split("-")
                    setSelectedReport({
                      reportId: parseInt(reportId, 10),
                      type: type as ReportInfo["type"],
                    })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择 Report" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableReports.length > 0 ? (
                      availableReports.map((report) => (
                        <SelectItem
                          key={`${report.reportId}-${report.type}`}
                          value={`${report.reportId}-${report.type}`}
                        >
                          Report ID: {report.reportId} ({report.type})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0-output">Report ID: 0 (默认)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h2 className="font-semibold">发送指令</h2>
                <div className="flex gap-2 items-start">
                  <Select
                    value={selectedCommand}
                    onValueChange={(value: string) => {
                      setSelectedCommand(value as CommandKey)
                      setLightValue("")
                    }}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="选择指令" />
                    </SelectTrigger>
                    <SelectContent>
                      {commandOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {needsLightInput && (
                    <div className="flex flex-col gap-1">
                      <Input
                        className="w-32"
                        placeholder="灯光值 (0-255)"
                        value={lightValue}
                        onChange={(e) => setLightValue(e.target.value)}
                      />
                      {lightValueError && (
                        <span className="text-red-500 text-xs">{lightValueError}</span>
                      )}
                    </div>
                  )}
                  <Button
                    onClick={handleSendCommand}
                    disabled={
                      !selectedCommand ||
                      sending ||
                      (needsLightInput && parsedLightValue === null)
                    }
                  >
                    {sending ? "发送中..." : "发送"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

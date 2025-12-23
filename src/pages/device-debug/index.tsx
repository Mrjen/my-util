import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as commands from "./k12/k12_commond"

const commandOptions = [
  { label: "将第1个按键改为A键", value: "set_1_to_a" },
  { label: "将第15个按键改为A键", value: "set_15_to_a" },
  { label: "将第16个按键改为A键", value: "set_16_to_a" },
  { label: "将第61个按键改为A键", value: "set_61_to_a" },
  { label: "重置键盘布局", value: "reset_keyboard_layout" },
  { label: "重置 FN1 层键盘布局", value: "reset_fn1_keyboard_layout" },
] as const

type CommandKey = (typeof commandOptions)[number]["value"]

interface ReportInfo {
  reportId: number
  type: "input" | "output" | "feature"
}

function parseHexString(hexString: string, length = 64): Uint8Array<ArrayBuffer> {
  const hexValues = hexString.split(",").map((s) => s.trim())
  const bytes = hexValues.map((hex) => parseInt(hex, 16))
  const buffer = new ArrayBuffer(length)
  const view = new Uint8Array(buffer)
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

    try {
      setSending(true)
      setError("")
      const commandString = commands[selectedCommand]
      const data = parseHexString(commandString)

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
                <div className="flex gap-2">
                  <Select
                    value={selectedCommand}
                    onValueChange={(value: string) => setSelectedCommand(value as CommandKey)}
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
                  <Button onClick={handleSendCommand} disabled={!selectedCommand || sending}>
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

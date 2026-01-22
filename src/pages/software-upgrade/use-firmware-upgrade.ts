import { useCallback, useRef, useState } from "react"
import {
  // CD-ROM 升级相关
  CDROM_CHUNK_SIZE,
  CHUNK_SIZE,
  chunk,
  createCdromDataPacket,
  createCdromSizePacket,
  createFirmwarePacket,
  createVerificationPacket,
  delay,
  K20_COMMANDS,
  type LogEntry,
  padEnd,
  parseCdromResponse,
  REPORT_SIZE,
  SEND_REPORT_ID,
  type UpgradeStatus,
} from "./firmware-utils"

interface UseFirmwareUpgradeReturn {
  // 状态
  devices: HIDDevice[]
  selectedDeviceIndex: number
  isInIAPMode: boolean
  status: UpgradeStatus
  progress: number
  logs: LogEntry[]
  error: string | null

  // 操作
  connectDevice: () => Promise<void>
  disconnectDevice: () => Promise<void>
  selectDevice: (index: number) => void
  enterIAPMode: () => Promise<void>
  uploadFirmware: (firmwareData: Uint8Array) => Promise<void>
  uploadCdrom: (cdromData: Uint8Array) => Promise<void>
  clearLogs: () => void
}

// 检查设备是否支持指定的 Feature Report ID
function deviceSupportsFeatureReport(device: HIDDevice, reportId: number): boolean {
  for (const collection of device.collections) {
    for (const report of collection.featureReports ?? []) {
      if (report.reportId === reportId) {
        return true
      }
    }
  }
  return false
}

// 查找支持指定 Feature Report ID 的设备
function findDeviceWithFeatureReport(devices: HIDDevice[], reportId: number): number {
  return devices.findIndex((dev) => deviceSupportsFeatureReport(dev, reportId))
}

export function useFirmwareUpgrade(): UseFirmwareUpgradeReturn {
  const [devices, setDevices] = useState<HIDDevice[]>([])
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(-1)
  const [isInIAPMode, setIsInIAPMode] = useState(false)
  const [status, setStatus] = useState<UpgradeStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef(false)

  const selectedDevice = selectedDeviceIndex >= 0 ? devices[selectedDeviceIndex] : null

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    setLogs((prev) => [...prev, { type, message, timestamp: new Date() }])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  // 发送 Feature Report
  const sendFeatureReport = async (dev: HIDDevice, data: number[]) => {
    const reportData = new Uint8Array(data)
    await dev.sendFeatureReport(SEND_REPORT_ID, reportData)
  }

  // 选择设备
  const selectDevice = useCallback(
    (index: number) => {
      if (index >= 0 && index < devices.length) {
        setSelectedDeviceIndex(index)
        const dev = devices[index]
        const supportsReport = deviceSupportsFeatureReport(dev, SEND_REPORT_ID)
        addLog(
          "info",
          `已选择设备接口 ${index}: ${supportsReport ? "支持" : "不支持"} Feature Report ID ${SEND_REPORT_ID}`,
        )
      }
    },
    [devices, addLog],
  )

  // 连接设备
  const connectDevice = useCallback(async () => {
    try {
      setError(null)
      setStatus("connecting")
      addLog("info", "正在请求 HID 设备...")

      const requestedDevices = await navigator.hid.requestDevice({
        filters: [], // 允许选择任意设备
      })

      if (requestedDevices.length === 0) {
        throw new Error("未选择设备")
      }

      // 打开所有设备接口
      for (const dev of requestedDevices) {
        if (!dev.opened) {
          await dev.open()
        }
      }

      setDevices(requestedDevices)
      addLog("info", `发现 ${requestedDevices.length} 个设备接口`)

      // 自动选择支持 Feature Report ID 的设备
      const autoSelectedIndex = findDeviceWithFeatureReport(requestedDevices, SEND_REPORT_ID)
      if (autoSelectedIndex >= 0) {
        setSelectedDeviceIndex(autoSelectedIndex)
        addLog(
          "success",
          `自动选择接口 ${autoSelectedIndex}（支持 Feature Report ID ${SEND_REPORT_ID}）`,
        )
      } else {
        // 如果没有找到，选择第一个
        setSelectedDeviceIndex(0)
        addLog("warn", `未找到支持 Feature Report ID ${SEND_REPORT_ID} 的接口，已选择第一个接口`)
      }

      const firstDev = requestedDevices[0]
      setStatus("idle")
      addLog(
        "success",
        `已连接: ${firstDev.productName || "未知设备"} (VID: ${firstDev.vendorId.toString(16).toUpperCase()}, PID: ${firstDev.productId.toString(16).toUpperCase()})`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "连接失败"
      setError(message)
      setStatus("idle")
      addLog("error", `连接失败: ${message}`)
    }
  }, [addLog])

  // 断开设备
  const disconnectDevice = useCallback(async () => {
    for (const dev of devices) {
      if (dev.opened) {
        await dev.close()
      }
    }
    setDevices([])
    setSelectedDeviceIndex(-1)
    setStatus("idle")
    addLog("info", "设备已断开")
  }, [devices, addLog])

  // 步骤1：进入 IAP 模式（设备会断开重连，用户需要手动重新连接）
  const enterIAPMode = useCallback(async () => {
    if (!selectedDevice) {
      setError("请先连接设备")
      return
    }

    setError(null)

    try {
      // 进入固件升级模式
      setStatus("entering_upgrade_mode")
      addLog("info", "正在进入固件升级模式...")
      const upgradeData = padEnd(K20_COMMANDS.ENTER_FIRMWARE_UPDATE, REPORT_SIZE, 0)
      await sendFeatureReport(selectedDevice, upgradeData)
      addLog("success", "已进入固件升级模式")
      await delay(500)

      // 进入 IAP 模式
      setStatus("entering_iap_mode")
      addLog("info", "正在进入 IAP 模式...")
      const iapData = padEnd(K20_COMMANDS.START_IAP_UPDATE, REPORT_SIZE, 0)

      // 发送命令（设备会断开，不等待响应）
      sendFeatureReport(selectedDevice, iapData).catch(() => {
        // 忽略错误，设备断开是预期行为
      })

      // 清空设备列表（因为设备已断开）
      setDevices([])
      setSelectedDeviceIndex(-1)
      setIsInIAPMode(true)
      setStatus("idle")

      addLog("success", "IAP 命令已发送，设备将重新连接")
      addLog("warn", "请点击「连接 HID 设备」重新连接设备，然后点击「上传固件」")
    } catch (err) {
      const message = err instanceof Error ? err.message : "进入 IAP 模式失败"
      setError(message)
      setStatus("error")
      addLog("error", `进入 IAP 模式失败: ${message}`)
    }
  }, [selectedDevice, addLog])

  // 步骤2：上传固件（设备已在 IAP 模式）
  const uploadFirmware = useCallback(
    async (firmwareData: Uint8Array) => {
      if (!selectedDevice) {
        setError("请先连接设备")
        return
      }

      abortRef.current = false
      setError(null)
      setProgress(0)

      try {
        // 发送固件数据
        setStatus("sending_firmware")
        addLog("info", `固件大小: ${firmwareData.length} 字节`)

        const firmwareArray = Array.from(firmwareData)
        const chunks = chunk(firmwareArray, CHUNK_SIZE)
        addLog("info", `分块数量: ${chunks.length}`)

        for (let i = 0; i < chunks.length; i++) {
          if (abortRef.current) {
            throw new Error("升级已取消")
          }

          const chunkData = chunks[i]
          const packet = createFirmwarePacket(chunkData)
          await sendFeatureReport(selectedDevice, packet)

          // 每个包发送后延迟 15ms
          await new Promise((resolve) => setTimeout(resolve, 15))

          const progressValue = Math.round(((i + 1) / chunks.length) * 100)
          setProgress(progressValue)

          if ((i + 1) % 50 === 0 || i === chunks.length - 1) {
            addLog("info", `发送进度: ${i + 1}/${chunks.length} (${progressValue}%)`)
          }
        }

        addLog("success", "固件数据发送完成")

        // 发送校验包
        addLog("info", "正在发送校验包...")
        const verificationPacket = createVerificationPacket(chunks[0])
        await sendFeatureReport(selectedDevice, verificationPacket)
        addLog("success", "校验包发送完成")

        // 结束升级
        setStatus("finishing")
        addLog("info", "正在完成升级...")
        const endData = padEnd(K20_COMMANDS.END_IAP_UPDATE, REPORT_SIZE, 0)
        await sendFeatureReport(selectedDevice, endData)
        addLog("success", "升级完成指令已发送")

        setStatus("success")
        setIsInIAPMode(false)
        addLog("success", "🎉 固件升级成功完成！")
      } catch (err) {
        const message = err instanceof Error ? err.message : "升级失败"
        setError(message)
        setStatus("error")
        addLog("error", `升级失败: ${message}`)
      }
    },
    [selectedDevice, addLog],
  )

  // CD-ROM 升级
  const uploadCdrom = useCallback(
    async (cdromData: Uint8Array) => {
      if (!selectedDevice) {
        setError("请先连接设备")
        return
      }

      abortRef.current = false
      setError(null)
      setProgress(0)

      try {
        // 步骤1：发送 CD-ROM 总字节数
        setStatus("sending_cdrom_size")
        addLog("info", `CD-ROM 文件大小: ${cdromData.length} 字节`)

        const sizePacket = createCdromSizePacket(cdromData.length)
        await sendFeatureReport(selectedDevice, sizePacket)
        addLog("info", "已发送 CD-ROM 文件大小")

        // 等待 15ms 后读取响应
        await delay(15)
        try {
          const response = await selectedDevice.receiveFeatureReport(SEND_REPORT_ID)
          const responseData = new Uint8Array(response.buffer)
          // 打印响应数据
          const hexStr = Array.from(responseData.slice(0, 32))
            .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
            .join(" ")
          addLog("info", `设备响应: ${hexStr}...`)
          console.log("Response:", hexStr)

          const parsed = parseCdromResponse(responseData)
          if (parsed.isValid) {
            addLog("success", `设备已确认接收文件大小，包号: ${parsed.packetNumber}`)
          } else {
            addLog("warn", "设备响应格式异常，继续发送数据")
          }
        } catch {
          addLog("warn", "无法读取设备响应，继续发送数据")
        }

        // 步骤2：分包发送 CD-ROM 数据
        setStatus("sending_cdrom_data")
        const cdromArray = Array.from(cdromData)
        const chunks = chunk(cdromArray, CDROM_CHUNK_SIZE)
        addLog("info", `分块数量: ${chunks.length}`)

        for (let i = 0; i < chunks.length; i++) {
          if (abortRef.current) {
            throw new Error("升级已取消")
          }

          const chunkData = chunks[i]
          const packet = createCdromDataPacket(chunkData)
          await sendFeatureReport(selectedDevice, packet)

          // 每包发送后延迟 15ms
          await delay(5)

          // 尝试读取响应确认
          try {
            const response = await selectedDevice.receiveFeatureReport(SEND_REPORT_ID)
            const responseData = new Uint8Array(response.buffer)
            const parsed = parseCdromResponse(responseData)

            // 每 100 包打印一次响应日志
            if ((i + 1) % 100 === 0 || i === 0) {
              const hexStr = Array.from(responseData)
                .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
                .join(" ")
              addLog("info", `包 ${i + 1} 响应: ${hexStr}...`)
            }

            if (parsed.isValid && parsed.packetNumber !== i + 1) {
              addLog("warn", `包号不匹配: 期望 ${i + 1}, 实际 ${parsed.packetNumber}`)
            }
          } catch {
            // 读取响应失败，继续发送（降级模式）
          }

          const progressValue = Math.round(((i + 1) / chunks.length) * 100)
          setProgress(progressValue)

          if ((i + 1) % 100 === 0 || i === chunks.length - 1) {
            addLog("info", `发送进度: ${i + 1}/${chunks.length} (${progressValue}%)`)
          }
        }

        addLog("success", "CD-ROM 数据发送完成")
        setStatus("success")
        addLog("success", "CD-ROM 升级成功完成！")
      } catch (err) {
        const message = err instanceof Error ? err.message : "CD-ROM 升级失败"
        setError(message)
        setStatus("error")
        addLog("error", `CD-ROM 升级失败: ${message}`)
      }
    },
    [selectedDevice, addLog],
  )

  return {
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
    uploadCdrom,
    clearLogs,
  }
}

// 固件升级相关常量
export const SEND_REPORT_ID = 3
export const CHUNK_SIZE = 52
export const REPORT_SIZE = 64

// CD-ROM 升级相关常量
export const CDROM_CHUNK_SIZE = 47 // CD-ROM 每包有效数据大小
export const CDROM_CMD_SIZE = 0x73 // 发送 CD-ROM 总字节数命令
export const CDROM_CMD_DATA = 0x74 // 发送 CD-ROM 数据命令

// K20 命令
export const K20_COMMANDS = {
  // 进入固件升级模式
  ENTER_FIRMWARE_UPDATE: [
    0xa5, 0x5a, 0xfc, 0x2e, 0x04, 0x2b, 0x01, 0x00, 0x01, 0xfc, 0x5a, 0xa5, 0x7c, 0x7b,
  ],
  // 开始 IAP 升级
  START_IAP_UPDATE: [0xa5, 0x5a, 0xfc, 0x2e, 0x03, 0x81, 0x00, 0x00, 0xfc, 0x5a, 0xa5, 0x21, 0xf3],
  // 结束 IAP 升级
  END_IAP_UPDATE: [0xa5, 0x5a, 0xfc, 0x2e, 0x03, 0x83, 0x00, 0x00, 0xfc, 0x5a, 0xa5, 0xc3, 0xf2],
}

// CRC16 计算
export function crc16(data: number[]): [number, number] {
  let crcValue = 0xffff
  for (let i = 0; i < data.length; i++) {
    crcValue ^= data[i]
    for (let j = 0; j < 8; j++) {
      if (crcValue & 0x0001) {
        crcValue = (crcValue >> 1) ^ 0xa001
      } else {
        crcValue >>= 1
      }
    }
  }
  const highByte = (crcValue >> 8) & 0xff
  const lowByte = crcValue & 0xff
  return [highByte, lowByte]
}

// 填充数组到指定长度
export function padEnd(array: number[], minLength: number, fillValue = 0): number[] {
  const result = new Array(minLength).fill(fillValue)
  for (let i = 0; i < array.length && i < minLength; i++) {
    result[i] = array[i]
  }
  return result
}

// 分块
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

// 创建固件数据包
export function createFirmwarePacket(chunkData: number[]): number[] {
  const hexLength = chunkData.length + 1
  const start = [0xa5, 0x5a, 0xfc, 0x2e, hexLength, 0x80]
  const raw = [...start, ...chunkData, 0xfc, 0x5a, 0xa5]
  const [crcHigh, crcLow] = crc16(raw)
  const packet = padEnd([...raw, crcHigh, crcLow], REPORT_SIZE, 0)
  return packet
}

// 创建校验包
export function createVerificationPacket(firstChunkData: number[]): number[] {
  const hexLength = firstChunkData.length + 1
  const start = [0xa5, 0x5a, 0xfc, 0x2e, hexLength, 0x82]
  const raw = [...start, ...firstChunkData, 0xfc, 0x5a, 0xa5]
  const [crcHigh, crcLow] = crc16(raw)
  const packet = padEnd([...raw, crcHigh, crcLow], REPORT_SIZE, 0)
  return packet
}

// 延迟函数
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 日志类型
export interface LogEntry {
  type: "info" | "error" | "warn" | "success"
  message: string
  timestamp: Date
}

// 升级状态
export type UpgradeStatus =
  | "idle"
  | "connecting"
  | "entering_upgrade_mode"
  | "entering_iap_mode"
  | "sending_firmware"
  | "verifying"
  | "finishing"
  | "success"
  | "error"
  // CD-ROM 升级状态
  | "sending_cdrom_size"
  | "sending_cdrom_data"

export const STATUS_MESSAGES: Record<UpgradeStatus, string> = {
  idle: "等待开始",
  connecting: "正在连接设备...",
  entering_upgrade_mode: "正在进入固件升级模式...",
  entering_iap_mode: "正在进入 IAP 模式...",
  sending_firmware: "正在发送固件数据...",
  verifying: "正在校验...",
  finishing: "正在完成升级...",
  success: "升级成功！",
  error: "升级失败",
  // CD-ROM 升级状态消息
  sending_cdrom_size: "正在发送 CD-ROM 文件大小...",
  sending_cdrom_data: "正在发送 CD-ROM 数据...",
}

// CD-ROM 升级类型
export type UpgradeType = "firmware" | "cdrom"

// 创建 CD-ROM 总字节数数据包
// 帧结构: [0xA5, 0x5A, 0xFC, 0x2E, 0x05, 0x73, Size(4字节小端), 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]
export function createCdromSizePacket(totalSize: number): number[] {
  // 将总字节数转换为 4 字节小端格式
  const sizeBytes = [
    totalSize & 0xff,
    (totalSize >> 8) & 0xff,
    (totalSize >> 16) & 0xff,
    (totalSize >> 24) & 0xff,
  ]
  const raw = [0xa5, 0x5a, 0xfc, 0x2e, 0x05, CDROM_CMD_SIZE, ...sizeBytes, 0xfc, 0x5a, 0xa5]
  const [crcHigh, crcLow] = crc16(raw)
  const packet = padEnd([...raw, crcHigh, crcLow], REPORT_SIZE, 0)
  return packet
}

// 创建 CD-ROM 数据包
// 帧结构: [0xA5, 0x5A, 0xFC, 0x2E, 数据长度+1, 0x74, 数据内容, 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]
export function createCdromDataPacket(chunkData: number[]): number[] {
  const dataLength = chunkData.length + 1 // 数据长度 = 实际数据 + 命令字节
  const raw = [0xa5, 0x5a, 0xfc, 0x2e, dataLength, CDROM_CMD_DATA, ...chunkData, 0xfc, 0x5a, 0xa5]
  const [crcHigh, crcLow] = crc16(raw)
  const packet = padEnd([...raw, crcHigh, crcLow], REPORT_SIZE, 0)
  return packet
}

// CD-ROM 响应解析结果
export interface CdromResponse {
  isValid: boolean
  command: number
  packetNumber: number
}

// 解析 CD-ROM 设备响应
// 响应格式: [0xA5, 0x5A, 0xFF, 0x2E, 0x05, 命令, 包号(4字节小端), 0xFF, 0x5A, 0xA5, CRC16H, CRC16L]
export function parseCdromResponse(data: Uint8Array): CdromResponse {
  // 验证帧头
  if (data[0] !== 0xa5 || data[1] !== 0x5a || data[2] !== 0xff) {
    return { isValid: false, command: 0, packetNumber: 0 }
  }

  const command = data[5]
  // 解析包号 (4字节小端)
  const packetNumber = data[6] | (data[7] << 8) | (data[8] << 16) | (data[9] << 24)

  return { isValid: true, command, packetNumber }
}
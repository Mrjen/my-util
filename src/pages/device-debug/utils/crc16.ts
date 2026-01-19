/**
 * 计算 CRC16 校验和 (Modbus CRC16)
 * @param message 消息字节数组
 * @param len 消息长度
 * @returns [高字节十六进制字符串, 低字节十六进制字符串]
 */
export function crc16GetValue(message: number[], len: number): [string, string] {
  let crcValue = 0xffff
  for (let i = 0; i < len; i++) {
    crcValue ^= Number(message[i])
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
  return [
    highByte.toString(16).padStart(2, "0").toUpperCase(),
    lowByte.toString(16).padStart(2, "0").toUpperCase(),
  ]
}

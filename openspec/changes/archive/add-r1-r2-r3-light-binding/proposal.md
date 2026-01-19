# Change: 添加 R1/R2/R3 灯光绑定指令

## Why
用户需要通过设备调试页面向 HID 设备发送自定义灯光绑定指令。目前的指令都是预设的静态值，无法动态配置灯光参数。R1/R2/R3 灯光绑定指令需要用户输入灯光数值，并动态计算 CRC16 校验。

## What Changes
- 在 `commandOptions` 中添加三个新指令选项：绑定 R1 灯光、绑定 R2 灯光、绑定 R3 灯光
- 当用户选择这三个指令时，显示一个输入框让用户输入灯光数值 (0x00-0xFF)
- 添加 `crc16GetValue` 函数用于计算 Modbus CRC16 校验
- 发送指令时根据用户输入动态构建命令字节数组并附加 CRC16 校验

## Impact
- Affected specs: device-debug (新建)
- Affected code:
  - [src/pages/device-debug/index.tsx](src/pages/device-debug/index.tsx) - 添加输入框 UI 和动态指令构建逻辑
  - [src/pages/device-debug/k12/k12_commond.ts](src/pages/device-debug/k12/k12_commond.ts) - 添加新指令常量定义
  - 新增 `src/pages/device-debug/utils/crc16.ts` - CRC16 计算工具函数

## Protocol Details
根据协议文档，R1/R2/R3 灯光绑定指令格式为：

| 字段 | 值 |
|------|-----|
| 数据帧头 | 0xA5, 0x5A |
| 帧头标志 | 0xFC |
| 数据类型 | 0x2E |
| 数据长度 | 0x03 |
| 数据命令 | 0x6F |
| 数据 Byte7 | R1=0x01, R2=0x02, R3=0x03 |
| 数据 Byte8 | 灯光数值 (用户输入) |
| 帧尾标志 | 0xFC |
| 数据帧尾 | 0x5A, 0xA5 |
| CRC16 | 计算所得 |

示例：
- R1 绑定 "彩虹渐变" (0x01): `0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x01, 0x01, 0xFC, 0x5A, 0xA5, 0x53, 0xD8`
- R2 绑定 "繁星点点" (0x02): `0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x02, 0x02, 0xFC, 0x5A, 0xA5, 0x17, 0x9C`
- R3 绑定 "刀山火海" (0x07): `0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x03, 0x07, 0xFC, 0x5A, 0xA5, 0xDB, 0xD8`

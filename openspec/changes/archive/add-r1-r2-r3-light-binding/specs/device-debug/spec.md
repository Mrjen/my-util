# Device Debug - R1/R2/R3 Light Binding

## ADDED Requirements

### Requirement: CRC16 Checksum Calculation
系统 SHALL 提供 Modbus CRC16 校验计算功能，用于生成 HID 指令的校验码。

#### Scenario: 计算标准消息的 CRC16
- **GIVEN** 一个字节数组消息
- **WHEN** 调用 `crc16GetValue(message, len)` 函数
- **THEN** 返回包含高字节和低字节的十六进制字符串元组

#### Scenario: CRC16 结果验证 - R1 彩虹渐变
- **GIVEN** 消息为 `[0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x01, 0x01, 0xFC, 0x5A, 0xA5]`
- **WHEN** 计算 CRC16
- **THEN** 返回 `["53", "D8"]`

### Requirement: R1/R2/R3 Light Binding Commands
系统 SHALL 支持 R1、R2、R3 三个快捷键的灯光效果绑定指令。

#### Scenario: 显示灯光绑定指令选项
- **GIVEN** 用户已连接 HID 设备
- **WHEN** 打开指令选择下拉框
- **THEN** 显示 "绑定 R1 灯光"、"绑定 R2 灯光"、"绑定 R3 灯光" 选项

#### Scenario: 显示灯光数值输入框
- **GIVEN** 用户已选择 R1/R2/R3 灯光绑定指令之一
- **WHEN** 选中该指令
- **THEN** 显示一个输入框，提示用户输入灯光数值

#### Scenario: 输入灯光数值
- **GIVEN** 显示灯光数值输入框
- **WHEN** 用户输入灯光数值 (支持十进制或 0x 前缀的十六进制)
- **THEN** 系统接受并解析该输入值

### Requirement: Dynamic Command Building
系统 SHALL 根据用户输入的灯光数值动态构建 HID 指令。

#### Scenario: 构建 R1 灯光绑定指令
- **GIVEN** 用户选择 "绑定 R1 灯光" 并输入灯光值 0x01
- **WHEN** 点击发送按钮
- **THEN** 系统构建指令 `[0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x01, 0x01, 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]`

#### Scenario: 构建 R2 灯光绑定指令
- **GIVEN** 用户选择 "绑定 R2 灯光" 并输入灯光值 0x02
- **WHEN** 点击发送按钮
- **THEN** 系统构建指令 `[0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x02, 0x02, 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]`

#### Scenario: 构建 R3 灯光绑定指令
- **GIVEN** 用户选择 "绑定 R3 灯光" 并输入灯光值 0x07
- **WHEN** 点击发送按钮
- **THEN** 系统构建指令 `[0xA5, 0x5A, 0xFC, 0x2E, 0x03, 0x6F, 0x03, 0x07, 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]`

### Requirement: Input Validation
系统 SHALL 验证灯光数值输入的有效性。

#### Scenario: 有效输入 - 十进制
- **GIVEN** 用户在灯光数值输入框中输入 "7"
- **WHEN** 验证输入
- **THEN** 接受输入，解析为 0x07

#### Scenario: 有效输入 - 十六进制
- **GIVEN** 用户在灯光数值输入框中输入 "0x0A"
- **WHEN** 验证输入
- **THEN** 接受输入，解析为 0x0A

#### Scenario: 无效输入 - 超出范围
- **GIVEN** 用户在灯光数值输入框中输入 "256" 或 "0x100"
- **WHEN** 验证输入
- **THEN** 显示错误提示，禁止发送

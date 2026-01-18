## ADDED Requirements

### Requirement: CD-ROM Upgrade Type Selection

系统 SHALL 提供升级类型选择功能，允许用户在"固件升级"和"CD-ROM 升级"两种模式之间切换。

#### Scenario: 默认选择固件升级

- **GIVEN** 用户打开软件升级页面
- **WHEN** 页面加载完成
- **THEN** 默认选中"固件升级"模式

#### Scenario: 切换到 CD-ROM 升级模式

- **GIVEN** 用户已连接设备
- **WHEN** 用户选择"CD-ROM 升级"模式
- **THEN** "进入 IAP 模式"按钮被隐藏
- **AND** 显示"开始升级"按钮

### Requirement: CD-ROM File Selection

系统 SHALL 支持选择 CD-ROM bin 文件进行升级。

#### Scenario: 选择 CD-ROM 文件

- **GIVEN** 用户选择了"CD-ROM 升级"模式
- **WHEN** 用户点击选择文件按钮并选择一个 .bin 文件
- **THEN** 系统显示文件名和文件大小
- **AND** 计算并显示文件的 MD5 校验值

### Requirement: CD-ROM Upgrade Protocol - Send Total Size

系统 SHALL 在开始 CD-ROM 升级时首先发送文件总字节数。

#### Scenario: 发送 CD-ROM 总字节数成功

- **GIVEN** 用户选择了 CD-ROM 文件并点击开始升级
- **WHEN** 系统发送总字节数命令 (0x73)
- **THEN** 命令格式为: `[0xA5, 0x5A, 0xFC, 0x2E, 0x05, 0x73, Size(4字节小端), 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]`
- **AND** 系统等待设备响应确认
- **AND** 日志记录发送的总字节数

#### Scenario: 设备响应总字节数确认

- **GIVEN** 系统已发送总字节数命令
- **WHEN** 设备返回响应 `[0xA5, 0x5A, 0xFF, 0x2E, ...]`
- **THEN** 系统验证响应中的字节数与发送值匹配
- **AND** 继续进入数据发送阶段

### Requirement: CD-ROM Upgrade Protocol - Send Data Packets

系统 SHALL 将 CD-ROM 文件分包发送给设备，每包有效数据为 47 字节。

#### Scenario: 分包发送 CD-ROM 数据

- **GIVEN** 设备已确认接收总字节数
- **WHEN** 系统开始发送数据
- **THEN** 系统将文件按 47 字节分包
- **AND** 每包格式为: `[0xA5, 0x5A, 0xFC, 0x2E, 长度, 0x74, 数据(最多47字节), 0xFC, 0x5A, 0xA5, CRC16H, CRC16L]`
- **AND** 每包发送后延迟 15ms

#### Scenario: 读取设备响应确认

- **GIVEN** 系统已发送一个数据包并等待 15ms
- **WHEN** 系统读取设备响应
- **THEN** 响应格式为: `[0xA5, 0x5A, 0xFF, 0x2E, 0x05, 0x74, 包号(4字节), 0xFF, 0x5A, 0xA5, CRC16H, CRC16L]`
- **AND** 系统验证包号与已发送包数匹配

#### Scenario: 数据包发送进度更新

- **GIVEN** 系统正在发送 CD-ROM 数据
- **WHEN** 每发送一个数据包
- **THEN** 进度条根据已发送包数/总包数更新
- **AND** 每 50 包或最后一包时记录日志

### Requirement: CD-ROM Upgrade Completion

系统 SHALL 在所有数据包发送完成后标记升级成功。

#### Scenario: CD-ROM 升级成功完成

- **GIVEN** 所有数据包已发送并确认
- **WHEN** 最后一个响应确认收到
- **THEN** 状态变为"升级成功"
- **AND** 日志记录升级完成
- **AND** 设备保持连接状态（无需重连）

### Requirement: CD-ROM Upgrade Error Handling

系统 SHALL 处理 CD-ROM 升级过程中的错误情况。

#### Scenario: 设备响应包号不匹配

- **GIVEN** 系统已发送数据包 N
- **WHEN** 设备响应的包号不等于 N
- **THEN** 状态变为"升级失败"
- **AND** 日志记录错误信息，包含期望包号和实际包号

#### Scenario: 设备无响应

- **GIVEN** 系统已发送数据包并等待响应
- **WHEN** 读取响应超时或失败
- **THEN** 系统记录警告日志
- **AND** 继续发送下一包（降级模式）

#### Scenario: 设备断开连接

- **GIVEN** CD-ROM 升级正在进行
- **WHEN** 设备断开连接
- **THEN** 状态变为"升级失败"
- **AND** 日志记录"设备连接中断"

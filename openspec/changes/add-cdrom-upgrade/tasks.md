# Tasks: 添加 CD-ROM 升级功能

## 1. 协议层实现

- [x] 1.1 在 `firmware-utils.ts` 中添加 CD-ROM 相关常量
  - CD-ROM 数据块大小 (47 字节有效数据)
  - 命令标识符 (0x73, 0x74)
- [x] 1.2 实现 `createCdromSizePacket()` 函数 - 创建发送总字节数的数据包
- [x] 1.3 实现 `createCdromDataPacket()` 函数 - 创建 CD-ROM 数据包
- [x] 1.4 实现 `parseCdromResponse()` 函数 - 解析设备响应

## 2. Hook 层实现

- [x] 2.1 扩展 `UpgradeStatus` 类型，添加 CD-ROM 相关状态
  - `sending_cdrom_size` - 发送总字节数
  - `sending_cdrom_data` - 发送 CD-ROM 数据
- [x] 2.2 在 `useFirmwareUpgrade` hook 中添加 `uploadCdrom()` 方法
  - 发送总字节数并等待确认
  - 分包发送数据，每包后延迟 15ms 并读取响应
  - 更新进度状态

## 3. UI 层实现

- [x] 3.1 添加"升级类型"选择器组件
  - 选项: 固件升级 / CD-ROM 升级
- [x] 3.2 根据升级类型调整 UI 显示
  - CD-ROM 模式: 隐藏"进入 IAP 模式"按钮
  - CD-ROM 模式: 直接显示"开始升级"按钮
- [x] 3.3 更新状态消息显示，支持 CD-ROM 升级状态

## 4. 测试与验证

- [x] 4.1 测试固件升级流程仍正常工作（回归测试）
- [ ] 4.2 测试 CD-ROM 升级完整流程
- [ ] 4.3 测试大文件 CD-ROM 升级的进度显示
- [ ] 4.4 测试错误处理（设备断开、传输失败等）

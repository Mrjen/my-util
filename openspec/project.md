# Project Context

## Purpose
my-util 是一个开发者实用工具集合，提供多种内部开发和调试工具。包括软件升级工具、Redux Persist 数据解析工具、以及 HID 设备调试工具。

## Tech Stack
- **核心框架**: React 19 + TypeScript + Vite 7
- **路由**: react-router v7
- **样式**: Tailwind CSS v4 (通过 @tailwindcss/vite 插件)
- **UI 组件库**: Radix UI 原语 + shadcn/ui 风格组件
  - 样式工具: class-variance-authority (CVA) + clsx + tailwind-merge
  - 图标: lucide-react
- **代码规范**: ESLint + Biome

## Project Conventions

### Code Style
- 缩进: 2 空格
- 引号: 双引号
- 分号: 仅在必要时使用 (ASI)
- 行宽: 100 字符
- 使用 Biome 进行格式化和检查
- 路径别名: `@/` 映射到 `src/` 目录

### Architecture Patterns
- **目录结构**:
  - `src/components/ui/` - 基础 UI 组件 (shadcn/ui 风格)
  - `src/components/` - 应用级组件
  - `src/pages/` - 页面组件，按功能模块划分
  - `src/hooks/` - 自定义 React Hooks
  - `src/lib/` - 工具函数
- **新增页面流程**:
  1. 在 `src/pages/` 下创建页面目录
  2. 在 `src/App.tsx` 中添加 Route
  3. 在 `src/components/AppSidebar.tsx` 的 `menuItems` 中添加导航项

### Testing Strategy
[暂无测试配置，可后续添加 Vitest]

### Git Workflow
- 主分支: main
- 提交信息格式: 遵循常规提交规范 (feat/fix/docs 等)

## Domain Context
- **软件升级工具**: 用于软件版本升级相关操作
- **Redux Persist 解析**: 解析和查看 Redux Persist 存储的数据
- **HID 设备调试**: 使用 WebHID API 与 HID 设备通信，支持发送命令和接收响应

## Important Constraints
- WebHID API 仅在支持的浏览器中可用 (Chrome/Edge)
- 作为 SPA 部署，使用 Vercel 配置进行路由重写

## External Dependencies
- **WebHID API**: 浏览器原生 API，用于 HID 设备通信
- **类型定义**: `@types/w3c-web-hid` 提供 WebHID 类型支持

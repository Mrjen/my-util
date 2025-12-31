<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 开发
bun dev              # 启动开发服务器 (Vite)

# 构建
bun run build        # TypeScript 编译 + Vite 构建

# 代码质量
bun lint             # ESLint 检查
bun format           # Biome 格式化
bun check            # Biome 检查并修复

# 预览
bun preview          # 预览构建产物
```

## 技术栈

- **框架**: React 19 + TypeScript + Vite 7
- **路由**: react-router v7
- **样式**: Tailwind CSS v4 (通过 @tailwindcss/vite 插件)
- **UI 组件**: Radix UI + shadcn/ui 风格组件 (CVA + clsx + tailwind-merge)
- **代码规范**: ESLint + Biome

## 项目架构

```
src/
├── components/
│   ├── ui/           # 基础 UI 组件 (shadcn/ui 风格)
│   └── AppSidebar.tsx # 应用侧边栏导航
├── pages/            # 页面组件，按功能模块划分
│   ├── software-upgrade/    # 软件升级工具
│   ├── redux-persist-parse/ # Redux Persist 数据解析工具
│   └── device-debug/        # HID 设备调试工具 (WebHID API)
├── hooks/            # 自定义 React Hooks
├── lib/
│   └── utils.ts      # 工具函数 (cn 函数用于合并类名)
├── App.tsx           # 路由配置 + 布局
└── main.tsx          # 应用入口
```

## 关键约定

### 路径别名
使用 `@/` 作为 `src/` 目录的别名，配置在 `vite.config.ts` 和 `tsconfig.json` 中。

### 代码风格 (Biome)
- 缩进: 2 空格
- 引号: 双引号
- 分号: 仅在必要时使用 (ASI)
- 行宽: 100 字符

### 新增页面
1. 在 `src/pages/` 下创建页面目录
2. 在 `src/App.tsx` 中添加 Route
3. 在 `src/components/AppSidebar.tsx` 的 `menuItems` 中添加导航项

## 特殊功能

### WebHID API (设备调试页面)
项目使用 WebHID API 与 HID 设备通信，类型定义来自 `@types/w3c-web-hid`。设备命令定义在 `src/pages/device-debug/k12/` 目录下。
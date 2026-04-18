# Rewrite Project Spec for Astro Stack

## Goal
将项目 spec 从 Electron + React + TypeScript 模板重写为 Astro + React + TypeScript + Tailwind CSS + GSAP 技术栈。

## Current State
- **模板技术栈**: Electron + React + TypeScript + SQLite
- **实际技术栈**: Astro 6.x + React 19 + TypeScript + Tailwind CSS 4 + GSAP
- **构建工具**: Vite (via Astro)
- **Linter**: Biome

## Requirements

### 1. 删除不再适用的文档
以下文档与 Electron 相关，需要删除：
- `backend/` 整个目录（Electron Main Process 相关）
- `frontend/ipc-electron.md`
- `frontend/electron-browser-api-restrictions.md`
- `shared/pnpm-electron-setup.md`
- `guides/` 中与数据库事务、IPC 相关的部分

### 2. 修改现有文档
以下文档需要调整以适应新技术栈：
- `frontend/index.md` - 移除 Electron 引用，添加 Astro 引用
- `frontend/directory-structure.md` - 调整为 Astro 项目结构
- `frontend/state-management.md` - 移除 Electron IPC 状态管理
- `frontend/type-safety.md` - 调整导入路径约定
- `frontend/quality.md` - 使用 Biome 替代 ESLint
- `shared/index.md` - 更新共享代码说明

### 3. 新增文档
需要创建的新文档：
- `frontend/astro-integration.md` - Astro + React 集成模式
- `frontend/tailwind-css.md` - Tailwind CSS 4 使用规范
- `frontend/gsap-animation.md` - GSAP 动画最佳实践
- `frontend/astro-routing.md` - Astro 路由和页面结构
- `frontend/islands-architecture.md` - Astro Islands 架构说明

### 4. 保留并微调的文档
- `frontend/components.md` - React 组件规范（通用）
- `frontend/react-pitfalls.md` - React 常见问题（通用）
- `frontend/hooks.md` - React Hooks 模式（通用）
- `frontend/css-design.md` - CSS 设计原则（需添加 Tailwind 部分）
- `guides/code-reuse-thinking-guide.md` - 代码复用思维（通用）
- `guides/pre-implementation-checklist.md` - 实现前检查清单（通用）

## Acceptance Criteria
- [ ] 删除所有 Electron 特定文档
- [ ] 更新所有 index.md 以反映新技术栈
- [ ] 创建 Astro、Tailwind、GSAP 相关文档
- [ ] 确保所有代码示例使用正确的技术栈
- [ ] 保持文档的英文写作风格

## Technical Notes
- Astro 使用 Islands 架构，React 组件默认是静态的
- Tailwind CSS 4 使用新的配置方式（通过 CSS 文件）
- GSAP 需要在客户端组件中使用（使用 client:* 指令）
- 使用 Biome 替代 ESLint/Prettier

## File Changes Summary

### Delete (14 files)
```
.trellis/spec/backend/ (entire directory - 13 files)
.trellis/spec/frontend/ipc-electron.md
.trellis/spec/frontend/electron-browser-api-restrictions.md
.trellis/spec/shared/pnpm-electron-setup.md
```

### Modify (10 files)
```
.trellis/spec/frontend/index.md
.trellis/spec/frontend/directory-structure.md
.trellis/spec/frontend/state-management.md
.trellis/spec/frontend/type-safety.md
.trellis/spec/frontend/quality.md
.trellis/spec/frontend/css-design.md
.trellis/spec/shared/index.md
.trellis/spec/guides/index.md
.trellis/spec/guides/cross-layer-thinking-guide.md
.trellis/spec/README.md
```

### Create (5 files)
```
.trellis/spec/frontend/astro-integration.md
.trellis/spec/frontend/tailwind-css.md
.trellis/spec/frontend/gsap-animation.md
.trellis/spec/frontend/astro-routing.md
.trellis/spec/frontend/islands-architecture.md
```

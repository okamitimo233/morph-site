# brainstorm: 项目配置现代化和清理

## Goal

将项目从 Termux 兼容配置迁移到标准开发环境配置，补全缺失的开发工具配置，并清理过期文件。

## What I already know

**Termux 兼容配置：**

- `astro.config.mjs` 中 `server: { host: '0.0.0.0' }` - 用于 Termux 允许外部访问
- `noop-image-service.ts` - 自定义空操作图片服务，注释说明用于 Termux/Android
- 项目已安装 `sharp@0.34.5`，理论上可以使用标准图片服务

**缺失的配置文件：**

- 无 Prettier 配置（`.prettierrc*`）
- 无 EditorConfig（`.editorconfig`）在项目根目录
- 无 `.vscode/` 目录（工作区设置、推荐扩展）

**可能过期的文件：**

- `pnpm-workspace.yaml` - 单仓库项目，可能不需要 workspace 配置
- `packageManager: pnpm@11.0.0-rc.2` - 使用 RC 版本

**现有配置（正常）：**

- ESLint 已配置（`eslint.config.js`）
- TypeScript 已配置（`tsconfig.json`）
- `.impeccable.md` - 设计上下文文件，项目特定
- `AGENTS.md` - Trellis 指令文件，必要
- `skills-lock.json` - 技能锁文件，必要

## Assumptions (temporary)

- 用户已不在 Termux 环境开发，可以切换到标准配置
- 图片优化功能在标准环境下是有价值的
- 需要统一代码格式化规范

## Open Questions

1. ~~**图片服务**：是否切换到 Astro 默认图片服务？（需要 Sharp）~~ ✅ 完全移除 noop-image-service
2. ~~**pnpm workspace**：是否需要保留 `pnpm-workspace.yaml`？~~ ✅ 保留（用于构建配置）
3. ~~**Prettier 配置**：偏好哪种配置风格？~~ ✅ Standard 风格（无分号、单引号）
4. ~~**开发服务器 host**：是否移除 `host: '0.0.0.0'`？~~ ✅ 保留（支持移动设备测试）

## Requirements (evolving)

### 1. 补全开发环境配置

- [ ] 添加 Prettier 配置（Standard 风格：无分号、单引号）
- [ ] 添加 EditorConfig 配置
- [ ] 添加 `.vscode/settings.json`（可选但推荐）
- [ ] 添加 `.vscode/extensions.json`（推荐扩展列表）

### 2. 移除 Termux 兼容配置

- [ ] 删除 `src/services/noop-image-service.ts`
- [ ] 修改 `astro.config.mjs`：移除自定义 image.service 配置，使用 Astro 默认图片服务
- [ ] 验证图片功能正常工作

### 3. 保留的配置

- [x] `pnpm-workspace.yaml` - 保留（用于构建配置）
- [x] `server: { host: '0.0.0.0' }` - 保留（支持移动设备测试）

### 4. 依赖优化

- [ ] 将 `typescript-language-server` 从 dependencies 移到 devDependencies
- [ ] 添加 Prettier 及相关插件到 devDependencies

### 5. 更新 Trellis 开发流程规范

**遵循 trellis-meta Self-Iteration Protocol：**

1. **创建 `trellis-local` skill**（首次）
   - [ ] 创建 `.claude/skills/trellis-local/SKILL.md`
   - [ ] 记录 Trellis 基础版本和初始化日期

2. **更新规格文档**
   - [ ] 更新 `.trellis/spec/shared/code-quality.md` - 添加格式化规范
   - [ ] 更新 `.trellis/spec/frontend/quality.md` - 添加前端代码格式化要求
   - [ ] 更新 `.trellis/spec/shared/index.md` - 更新提交前检查清单

3. **修改命令文件**
   - [ ] 更新 `.claude/commands/trellis/finish-work.md` - 添加格式化检查步骤
   - [ ] 更新 `.claude/commands/trellis/commit.md` - Prerequisites 添加格式化检查

4. **记录所有修改到 `trellis-local` skill**
   - [ ] 在 `trellis-local/SKILL.md` 记录 Commands Modified 部分
   - [ ] 在 `trellis-local/SKILL.md` 记录 Specs Customized 部分
   - [ ] 更新 Changelog

## Acceptance Criteria (evolving)

- [ ] Prettier 配置文件存在且格式化正常工作
- [ ] EditorConfig 文件存在
- [ ] `src/services/noop-image-service.ts` 已删除
- [ ] `astro.config.mjs` 中不再引用 noop-image-service
- [ ] `pnpm lint` 通过
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm build` 成功
- [ ] 图片功能正常工作（使用 Astro 默认服务）
- [ ] Trellis 规范文档已更新，包含格式化要求

## Definition of Done (team quality bar)

- Lint / typecheck / build 通过
- 配置文件有适当注释
- 更新 CLAUDE.md 或相关文档

## Out of Scope (explicit)

- 不修改 `pnpm-workspace.yaml`
- 不修改开发服务器 host 配置
- 不修改 `.impeccable.md`、`AGENTS.md`、`skills-lock.json` 等项目特定文件
- 不重构其他现有代码

## Technical Approach

### Phase 1: 补全配置文件

1. **Prettier 配置**
   - 创建 `.prettierrc.json`，Standard 风格
   - 添加 `.prettierignore` 文件
   - 安装 `prettier` 到 devDependencies
   - 在 `package.json` 添加格式化脚本

2. **EditorConfig 配置**
   - 创建 `.editorconfig` 文件
   - 配置缩进、换行符、编码等

3. **VS Code 配置**（可选但推荐）
   - 创建 `.vscode/settings.json`
   - 创建 `.vscode/extensions.json`

### Phase 2: 移除 Termux 兼容配置

1. **删除 noop-image-service**
   - 删除 `src/services/noop-image-service.ts`
   - 修改 `astro.config.mjs`，移除 `image.service` 配置
   - Astro 会自动使用 Sharp 作为默认图片服务

2. **验证图片功能**
   - 运行 `pnpm build` 确保构建成功
   - 测试图片渲染功能

### Phase 3: 依赖优化

1. **整理 dependencies**
   - 移动 `typescript-language-server` 到 devDependencies
   - 添加格式化相关依赖

2. **更新脚本**
   - 添加 `format` 脚本
   - 添加 `format:check` 脚本

### Phase 4: 文档与规范更新

1. 更新 `CLAUDE.md` 说明新增的配置文件
2. 确保所有配置文件有适当注释
3. 更新 Trellis 规范：
   - `.trellis/spec/shared/code-quality.md` - 添加格式化规范和 Prettier 使用要求
   - `.trellis/spec/frontend/quality.md` - 添加前端代码格式化检查
   - `.trellis/spec/shared/index.md` - 更新 Before Every Commit 清单

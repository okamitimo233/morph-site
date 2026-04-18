# Telegram 风格主题切换水波动画

## Goal

重构 ThemeToggle 组件，实现 Telegram 风格的水波扩散主题切换动画：点击时从按钮位置扩散出圆形水波覆盖全页面，同时 SVG 图标使用 morphing 平滑变形。

## What I already know

* 现有 ThemeToggle.tsx 是下拉菜单式组件，支持 light/dark/system 三种模式
* 项目已安装 GSAP v3.15.0（专业级动画库）
* 使用 Tailwind CSS v4 + Astro + React islands 架构
* 主题切换通过 `data-theme` 属性控制（在 `document.documentElement`）
* 现有动画使用 CSS @keyframes scale-in
* useTheme hook 提供 `toggleTheme()` 方法可直接切换 light/dark

## Assumptions (temporary)

* 动画从点击位置（按钮中心）开始扩散
* 水波覆盖整个视口，实现全页面主题切换效果
* SVG morphing 使用 GSAP 实现（比纯 CSS 更可靠）
* 需要支持 `prefers-reduced-motion` 无障碍设置

## Decisions

1. **组件形态**: 简化为纯 Toggle 按钮，移除下拉菜单
2. **主题切换逻辑**: 点击直接切换 light ↔ dark
3. **默认行为**: 页面加载时默认使用 system 主题（匹配系统偏好）
4. **扩散起始点**: 从按钮中心扩散

## Requirements (final)

* 移除下拉菜单，改为单按钮 toggle
* 点击时触发 500ms 圆形水波扩散动画（从按钮中心）
* 图标使用 cross-fade + rotation 过渡（sun ↔ moon）
* 主题切换发生在动画完成时
* 支持 prefers-reduced-motion（跳过动画直接切换）
* 动画结束后清理覆盖层 DOM 元素
* 页面首次加载默认跟随 system 主题

## Acceptance Criteria (final)

* [ ] 点击按钮触发水波扩散动画，从按钮中心扩散至覆盖全页面
* [ ] 动画持续约 500ms
* [ ] 图标在动画过程中平滑过渡（sun ↔ moon）
* [ ] 主题在动画完成时切换
* [ ] 支持 prefers-reduced-motion：直接切换无动画
* [ ] 动画结束后移除覆盖层 DOM 元素
* [ ] 页面加载时默认使用 system 主题
* [ ] 键盘可访问（Enter/Space 触发）

## Definition of Done

* 组件重构完成，视觉测试通过
* Lint / typecheck / CI 通过
* 无障碍测试通过（键盘导航、reduced motion）

## Out of Scope (explicit)

* system 主题手动设置选项（自动跟随系统）
* Navbar 其他组件修改
* 颜色主题配置

## Technical Notes

### 相关文件
* `src/components/islands/ThemeToggle.tsx` - 主要修改目标
* `src/hooks/useTheme.ts` - 主题状态管理
* `src/styles/tokens.css` - 动画 tokens 和 keyframes
* `src/styles/global.css` - 全局样式

### 技术约束
* 使用 GSAP（已安装）
* React island 组件（client:load）
* 兼容 Tailwind CSS v4

---

## Research Notes

### 技术方案调研结果

#### 1. 水波扩散实现

| 方案 | 优点 | 缺点 |
|------|------|------|
| CSS clip-path circle | GPU 加速、代码简单 | 部分旧浏览器支持有限 |
| **Canvas 2D** (选定) | 完全控制、可绘制复杂形状、效果可控 | 每帧重绘 |
| Telegram 真实方案 | 内容逐元素裁剪 | 实现复杂 |

**选定方案**: Canvas 2D — 更灵活控制绘制效果

#### 2. SVG 图标变形

| 方案 | 说明 |
|------|------|
| **GSAP MorphSVGPlugin** (选定) | 路径平滑变形，效果最佳。现已免费！ |
| Cross-fade + rotation | 简单但不够"变形感" |

**选定方案**: GSAP MorphSVGPlugin — 实现真正的 sun ↔ moon 路径变形

> **重要发现**: GSAP 于 2024 年被 Webflow 收购后，所有插件（包括 MorphSVG）现已 100% 免费开放！

#### 3. 主题切换时机

**选定**: 动画完成后立即切换主题

#### 4. 无障碍支持

使用 `gsap.matchMedia()` 检测 `prefers-reduced-motion`，直接切换主题跳过动画。

### 最终实现方案

```
用户点击按钮
    ↓
获取按钮中心坐标（相对于视口）
    ↓
创建全屏 Canvas 覆盖层
    ↓
GSAP 动画: Canvas 绘制扩展圆形（目标主题背景色）
    ↓
同时: GSAP MorphSVG 变形图标（sun → moon 或 moon → sun）
    ↓
动画结束: 应用主题 + 移除 Canvas
```

### 依赖
* gsap (已安装 v3.15.0)
* gsap/MorphSVGPlugin (免费，需单独导入注册)

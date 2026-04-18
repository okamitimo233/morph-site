# brainstorm: 个人博客主页UI-UX设计

## Goal

从零设计一套精美的 UI-UX 设计系统，以个人博客主页作为首个示例实现，目标是制作一个最小可行的主页面。

## What I already know

**技术栈**：
- Astro 6.x（最新版）
- React 19 + Tailwind CSS 4
- GSAP 动画库
- TypeScript

**项目现状**：
- 全新 Astro 模板项目，无业务代码
- 已配置 Tailwind CSS 4 + React
- 已配置 GSAP 用于动画
- 有完善的 Trellis 工作流支持

**用户意图**：
- 设计一套可复用的 UI-UX 系统
- 以个人博客为示例界面
- 先做最小实现的主页面

## Design Context

**品牌个性**：现代化 · 精致 · 个性化

**视觉风格**：
- 基调：简约现代，带圆角、高级模糊、微妙渐变
- 背景：代码渲染的动态渐变流动 或 大图 Hero
- 滚动：视差效果、元素渐入、状态变化
- 动画：流畅但克制，服务于体验

**主题**：深色/浅色切换 + 跟随系统

**反风格**：千篇一律、极简空洞、过度平面化、冷冰冰科技感、霓虹光污染

> 详细设计规范见 `.impeccable.md`

## Assumptions (temporary)

- 主页面需要展示博客核心内容（文章列表、个人信息等）
- 需要考虑响应式设计
- 动画效果是差异化亮点
- 主题切换器是必要组件

## Requirements (evolving)

### MVP 模块

| 模块 | 说明 | 可复用性 |
|------|------|----------|
| **Navbar** | 固定顶部导航：Logo + 首页 + 文章 + 关于 + 项目 + 搜索 + 主题切换 | 所有页面 |
| **PlaceholderPages** | 文章/关于/项目页面的空页面占位 | 占位页面 |
| **Hero** | 大标题 + 副标题 + 头像 + Canvas/WebGL 动态背景 | 主页特有 |
| **FeaturedCarousel** | 精选文章轮播，大卡片 + 全交互（自动播放、手动切换、手势滑动、指示器、悬停暂停） | 主页特有 |
| **ArticleList** | 文章卡片网格列表（2-3列） | 博客页复用 |
| **SocialLinks** | GitHub + Twitter + Email 图标链接 | 页脚/关于页 |
| **Footer** | 版权、链接、RSS | 所有页面 |
| **ThemeToggle** | 深色/浅色/跟随系统切换 | 全局 |

### 可复用组件

| 组件 | 用途 |
|------|------|
| `Button` | 通用按钮（primary/ghost/outline） |
| `Card` | 文章卡片、项目卡片 |
| `Carousel` | 通用轮播组件（支持自动播放、手势滑动） |
| `Tag` | 标签（分类、技术栈） |
| `Container` | 内容容器，响应式宽度 |
| `ScrollIndicator` | 轮播指示器（圆点/数字） |

### 设计系统基础

| 基础设施 | 说明 |
|----------|------|
| **设计 tokens** | 颜色、间距、圆角、阴影、字体 |
| **CSS 变量** | 支持主题切换的变量系统 |
| **动画工具** | GSAP 封装，入场/滚动动画 |

### 字体方案

| 用途 | 字体 | 来源 |
|------|------|------|
| 标题 | Clash Display | Pangram Pangram |
| 正文 | Manrope | Google Fonts |
| 中文 Fallback | PingFang SC / Noto Sans SC | 系统/Google Fonts |

```css
font-family: 'Clash Display', 'Manrope', 'PingFang SC', 'Noto Sans SC', sans-serif;
```

## Acceptance Criteria

- [ ] 主页面完整渲染所有 MVP 模块
- [ ] 主题切换正常工作（深色/浅色/跟随系统）
- [ ] Hero 区域 Canvas 动态背景流畅运行
- [ ] 精选轮播支持所有交互（自动播放、手动切换、手势滑动、指示器、悬停暂停）
- [ ] 文章卡片网格响应式适配（移动端 1 列，平板 2 列，桌面 3 列）
- [ ] 导航栏固定顶部，滚动时状态变化
- [ ] 社交链接正确显示并可点击
- [ ] 页脚包含版权信息
- [ ] 占位页面（文章/关于/项目）可访问
- [ ] 字体正确加载显示
- [ ] 无控制台错误
- [ ] Lint / typecheck 通过

## Definition of Done

- `pnpm lint` 通过
- `pnpm typecheck` 通过
- `pnpm build` 成功
- 可在浏览器中正常预览
- 移动端/桌面端均可正常使用

## Out of Scope (explicit)

- 文章详情页实现
- 搜索功能实现
- 后台管理系统
- 数据库/真实数据
- 用户认证
- RSS 功能

## Technical Approach

### 文件结构

```
src/
├── components/
│   ├── ui/           # 可复用基础组件
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── Tag.astro
│   │   └── Container.astro
│   ├── layout/       # 布局组件
│   │   ├── Navbar.astro
│   │   └── Footer.astro
│   ├── home/         # 主页特定组件
│   │   ├── Hero.astro
│   │   ├── FeaturedCarousel.astro
│   │   └── ArticleList.astro
│   └── shared/       # 共享组件
│       ├── ThemeToggle.astro
│       ├── SocialLinks.astro
│       └── AnimatedBackground.tsx  # React + Canvas/WebGL
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── articles.astro
│   ├── about.astro
│   └── projects.astro
├── styles/
│   ├── global.css    # Tailwind + 设计 tokens
│   └── tokens.css    # 主题变量
└── data/
    └── mock.ts       # 模拟数据
```

### 子任务拆分

#### Task 1: 设计系统基础
- 设计 tokens（颜色、间距、圆角、阴影）
- 主题变量系统（浅色/深色/跟随系统）
- 字体加载配置

#### Task 2: 布局框架
- Layout.astro 更新
- Container 组件
- 基础样式结构

#### Task 3: 导航与主题切换
- Navbar 组件
- ThemeToggle 组件
- 主题切换逻辑

#### Task 4: Hero 区域
- AnimatedBackground (Canvas/WebGL)
- Hero 组件结构
- 动画效果

#### Task 5: 轮播组件
- Carousel 基础组件
- FeaturedCarousel 主页集成
- 全部交互功能

#### Task 6: 文章列表
- Card 组件
- ArticleList 组件
- 响应式网格

#### Task 7: 页脚与社交
- Footer 组件
- SocialLinks 组件
- Button/Tag 基础组件

#### Task 8: 占位页面与收尾
- 文章/关于/项目 占位页面
- 全局响应式检查
- 动画细节打磨

## Technical Notes

**技术约束**：
- Tailwind CSS 4 使用 CSS-first 配置（无 tailwind.config.js）
- Astro Islands 架构支持部分水合
- Canvas 组件使用 React（需要客户端渲染）
- 使用 OKLCH 色彩空间定义颜色

### 开发规范参考

**必须阅读**：

| 文档 | 说明 |
|------|------|
| `.trellis/spec/frontend/astro-integration.md` | Astro + React 集成 |
| `.trellis/spec/frontend/islands-architecture.md` | Islands 架构，水合策略 |
| `.trellis/spec/frontend/react-pitfalls.md` | React 常见陷阱 |
| `.trellis/spec/frontend/tailwind-css.md` | Tailwind CSS 4 配置 |
| `.trellis/spec/frontend/css-design.md` | CSS 设计系统 |

**参考文档**：

| 文档 | 说明 |
|------|------|
| `.trellis/spec/frontend/gsap-animation.md` | GSAP 动画规范 |
| `.agents/skills/gsap/SKILL.md` | GSAP 快速参考 |
| `.trellis/spec/frontend/components.md` | 组件设计规范 |
| `.trellis/spec/frontend/quality.md` | 代码质量规范 |
| `.impeccable.md` | 设计上下文 |

**关键规则**：

| 规则 | 来源 |
|------|------|
| 最小化客户端 JavaScript | islands-architecture.md |
| 使用正确的 `client:*` 指令 | astro-integration.md |
| 函数存入 useState 必须包裹 `() =>` | react-pitfalls.md |
| 对象/Date 作为 hook 依赖必须用 `useMemo` | react-pitfalls.md |
| 使用 `scrollbar-gutter: stable` | components.md |
| 使用 `gsap.context()` 进行清理 | gsap-animation.md |
| 只动画 transform 和 opacity | gsap-animation.md |
| 使用 OKLCH 色彩空间 | css-design.md |

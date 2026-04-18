# Telegram 风格主题切换动画

## Goal

重构 ThemeToggle 组件，简化为单按钮 toggle，使用 GSAP MorphSVG 实现图标变形动画，主题切换使用渐变过渡。

## What I already know

* 现有 ThemeToggle.tsx 是下拉菜单式组件，支持 light/dark/system 三种模式
* 项目已安装 GSAP v3.15.0
* GSAP 所有插件现在免费（包括 MorphSVGPlugin）
* 主题切换通过 `data-theme` 属性控制
* useTheme hook 提供 `toggleTheme()` 方法
* CSS transition 已配置，主题切换自带渐变效果

## Decisions

1. **组件形态**: 简化为纯 Toggle 按钮，移除下拉菜单
2. **主题切换逻辑**: 点击直接切换 light ↔ dark
3. **默认行为**: 页面加载时默认使用 system 主题
4. **动画方案**: MorphSVG 图标变形 + CSS 渐变过渡（移除水波扩散）

## Requirements (final)

* 移除下拉菜单，改为单按钮 toggle
* 点击时触发主题渐变过渡（CSS transition 已有）
* 图标使用 GSAP MorphSVG 路径变形（sun ↔ moon）
* 支持 prefers-reduced-motion
* 页面首次加载默认跟随 system 主题

## Acceptance Criteria (final)

* [ ] 点击按钮切换主题，触发渐变过渡动画
* [ ] 图标使用 MorphSVG 平滑变形（sun ↔ moon）
* [ ] 动画持续约 500ms
* [ ] 支持 prefers-reduced-motion：直接切换无动画
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
* 水波扩散动画（复杂度高，改为渐变过渡）

## Technical Approach

1. **MorphSVG 图标变形**
   - 导入 `gsap` 和 `MorphSVGPlugin`
   - sun 路径变形为 moon 路径
   - 使用 `gsap.to()` 动画，持续 500ms

2. **主题渐变过渡**
   - CSS transition 已在 `global.css` 配置
   - 调用 `toggleTheme()` 时自动触发

3. **Reduced Motion**
   - 使用 `gsap.matchMedia()` 检测
   - 跳过动画直接切换

## Technical Notes

### 相关文件
* `src/components/islands/ThemeToggle.tsx` - 主要修改
* `src/hooks/useTheme.ts` - 保持不变

### MorphSVG 用法
```typescript
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// sun path 变形为 moon path
gsap.to('#sun-path', {
  morphSVG: moonPath,
  duration: 0.5,
  ease: 'power2.inOut'
});
```

# Refactor noop-image-service to Eliminate Any Types

## Goal
重构 `src/services/noop-image-service.ts`，使用更优雅的类型定义替代 `any` 类型。

## Background
在图片优化任务中，为了兼容 Termux/Android 环境（Sharp 不可用），创建了 noop-image-service。当前使用了 `any` 类型的索引签名，虽然功能正确，但可以更优雅。

## Current Issues
```typescript
// 当前实现
type LocalTransform = {
  src: string;
  format?: string;
  [key: string]: any;  // 不够精确
};
```

## Possible Approaches
1. **使用 Astro 导出的类型** - 检查 Astro 是否导出了 `LocalImageTransform` 类型
2. **使用泛型约束** - 定义更精确的类型结构
3. **使用 unknown + 类型守卫** - 更安全的类型检查
4. **参考 Astro 官方实现** - 查看 `astro/assets/services/noop.js` 的 TypeScript 类型

## Acceptance Criteria
- [ ] 无 `any` 类型（或用 eslint-disable 注释说明原因）
- [ ] 类型定义精确且可读
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm lint` 通过
- [ ] 构建成功
- [ ] 图片功能正常

## References
- `node_modules/astro/dist/assets/services/noop.js` - Astro 官方 noop 实现
- `node_modules/astro/dist/assets/services/service.d.ts` - 类型定义

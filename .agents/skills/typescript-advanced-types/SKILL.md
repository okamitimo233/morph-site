---
name: typescript-advanced-types
description: TypeScript advanced type system - generics, conditional types, mapped types, template literals, and utility types for type-safe applications.
---

# TypeScript Advanced Types Quick Reference

## Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

## Mapped Types

```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
```

## Template Literal Types

```typescript
type EventHandler = `on${Capitalize<"click">}`;  // "onClick"
type Path<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never }[keyof T]
  : never;
```

## infer Keyword

```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;
type PromiseType<T> = T extends Promise<infer U> ? U : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
```

## Deep Utils

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function ? T[P] : DeepReadonly<T[P]>
    : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U> ? Array<DeepPartial<U>> : DeepPartial<T[P]>
    : T[P];
};
```

## Discriminated Unions

```typescript
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading"; requestId: string }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

// Type narrowing with switch
switch (state.status) {
  case "success": console.log(state.data); break;
  case "error": console.log(state.error); break;
}
```

## Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new Error("Not a string");
}
```

## Utility Types

| Type                     | Purpose                    |
| ------------------------ | -------------------------- |
| `Partial<T>`             | All properties optional    |
| `Required<T>`            | All properties required    |
| `Readonly<T>`            | All properties readonly    |
| `Pick<T, K>`             | Select properties          |
| `Omit<T, K>`             | Remove properties          |
| `Extract<T, U>`          | Extract from union         |
| `Exclude<T, U>`          | Exclude from union         |
| `NonNullable<T>`         | Exclude null/undefined     |
| `Record<K, T>`           | Object with keys K, values T |

## Rules

- Use `unknown` over `any`
- Use `=== true` for discriminated unions
- Prefer type guards over assertions
- Use `interface` for objects, `type` for unions

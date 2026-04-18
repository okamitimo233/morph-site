# TypeScript Advanced Types Examples

This directory contains advanced TypeScript patterns for type-safe applications.

## Files

| File                              | Description                    |
| --------------------------------- | ------------------------------ |
| `typed-event-emitter.ts.template` | Type-safe event emitter        |
| `deep-utils.ts.template`          | Deep Readonly/Partial utils    |
| `api-client.ts.template`          | Type-safe API client pattern   |
| `discriminated-union.ts.template` | State machine with unions      |

## Key Concepts

### Conditional Types
```typescript
type IsString<T> = T extends string ? true : false;
```

### Mapped Types
```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

### Template Literal Types
```typescript
type EventHandler = `on${Capitalize<"click">}`; // "onClick"
```

### infer Keyword
```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

## Usage

1. Copy the `.template` file to your project
2. Remove the `.template` suffix
3. Adapt types to your domain

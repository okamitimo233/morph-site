# TypeScript Best Practices

> TypeScript guidelines for building type-safe applications.

---

## Explicit Return Types

Always use explicit return types for exported functions:

```typescript
// BAD - Implicit return type
export function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

// GOOD - Explicit return type
export function getUser(id: string): User | undefined {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

// GOOD - Async with Promise
export async function getUser(id: string): Promise<User | undefined> {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}
```

---

## Use `type` for Object Types

```typescript
// Use type for most cases
type User = {
  id: string
  name: string
  email: string
}

// Use interface when you expect extension
interface Plugin {
  name: string
  init(): void
}

interface AdvancedPlugin extends Plugin {
  cleanup(): void
}
```

---

## Type Imports

Always use `import type` for type-only imports:

```typescript
// GOOD
import type { User, Project } from './types'
import { createUser } from './procedures'

// Also acceptable
import { type User, createUser } from './types'

// BAD - Mixed imports without type annotation
import { User, createUser } from './types'
```

---

## Zod Schema for Runtime Validation

Use Zod for all external data validation:

```typescript
import { z } from 'zod'

// Define schema
const userInputSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).optional(),
})

// Derive type from schema
type UserInput = z.infer<typeof userInputSchema>

// Validate input
const parseResult = userInputSchema.safeParse(rawInput)
if (!parseResult.success) {
  return { success: false, error: parseResult.error.issues[0].message }
}
const validInput = parseResult.data
```

---

## Discriminated Unions

Use strict equality for type narrowing:

```typescript
type Result = { success: true; data: string } | { success: false; error: string }

const result: Result = doSomething()

// CORRECT: Use === true
if (result.success === true) {
  console.log(result.data) // TypeScript knows data exists
} else {
  console.log(result.error) // TypeScript knows error exists
}

// WRONG: Truthy check may not narrow properly
if (result.success) {
  console.log(result.data)
} else {
  console.log(result.error) // May cause type error
}
```

---

## Type Guards

Create type guards for runtime type checking:

```typescript
// Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as User).id === 'string' &&
    typeof (value as User).email === 'string'
  )
}

// Usage
const data: unknown = JSON.parse(response)
if (isUser(data)) {
  console.log(data.email) // TypeScript knows it's a User
}

// With Zod (simpler)
const parseResult = userSchema.safeParse(data)
if (parseResult.success) {
  console.log(parseResult.data.email) // Type-safe
}
```

---

## Generics

Use generics for reusable type-safe functions:

```typescript
// Generic function
function first<T>(items: T[]): T | undefined {
  return items[0]
}

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Generic type
type Result<T> = { success: true; data: T } | { success: false; error: string }

function createResult<T>(data: T): Result<T> {
  return { success: true, data }
}
```

---

## Utility Types

Use built-in utility types:

```typescript
// Partial - all properties optional
type PartialUser = Partial<User>

// Required - all properties required
type RequiredUser = Required<User>

// Pick - select specific properties
type UserName = Pick<User, 'name' | 'email'>

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>

// Record - key-value mapping
type UserMap = Record<string, User>

// ReturnType - extract function return type
type CreateResult = ReturnType<typeof createUser>
```

---

## Avoid Common Pitfalls

### Don't use `any`

```typescript
// BAD
function process(data: any) { ... }

// GOOD
function process(data: unknown) { ... }
function process(data: ProcessInput) { ... }
```

### Don't use non-null assertion

```typescript
// BAD
const name = user!.name

// GOOD
if (user) {
  const name = user.name
}
```

### Don't ignore TypeScript errors

```typescript
// BAD
// @ts-ignore
doSomething(invalidArg)

// GOOD - Fix the type issue
doSomething(validArg)
```

---

## Summary

| Practice              | Reason                      |
| --------------------- | --------------------------- |
| Explicit return types | Documentation, catch errors |
| `import type`         | Clear separation            |
| Zod for validation    | Runtime type safety         |
| `=== true` for unions | Proper narrowing            |
| Type guards           | Runtime checks              |
| Generics              | Reusability                 |
| Utility types         | DRY types                   |
| Avoid `any`           | Type safety                 |

---

## Conditional Types

Create types that depend on conditions:

### Basic Conditional Type

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string> // true
type B = IsString<number> // false
```

### Extracting Return Types with infer

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: 'John' }
}

type User = ReturnType<typeof getUser>
// Type: { id: number; name: string; }
```

### Distributive Conditional Types

```typescript
type ToArray<T> = T extends any ? T[] : never

type StrOrNumArray = ToArray<string | number>
// Type: string[] | number[]
```

### Nested Conditions

```typescript
type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends undefined
        ? 'undefined'
        : T extends Function
          ? 'function'
          : 'object'
```

---

## Mapped Types

Transform existing types by iterating over their properties.

### Basic Mapped Type

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

interface User {
  id: number
  name: string
}

type ReadonlyUser = Readonly<User>
// Type: { readonly id: number; readonly name: string; }
```

### Key Remapping

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// Type: { getName: () => string; getAge: () => number; }
```

### Filtering Properties

```typescript
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

interface Mixed {
  id: number
  name: string
  age: number
  active: boolean
}

type OnlyNumbers = PickByType<Mixed, number>
// Type: { id: number; age: number; }
```

---

## Template Literal Types

Create string-based types with pattern matching.

### Basic Template Literal

```typescript
type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<EventName>}`
// Type: "onClick" | "onFocus" | "onBlur"
```

### String Manipulation

```typescript
type UppercaseGreeting = Uppercase<'hello'> // "HELLO"
type LowercaseGreeting = Lowercase<'HELLO'> // "hello"
type CapitalizedName = Capitalize<'john'> // "John"
type UncapitalizedName = Uncapitalize<'John'> // "john"
```

### Path Building

```typescript
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never
    }[keyof T]
  : never

interface Config {
  server: {
    host: string
    port: number
  }
  database: {
    url: string
  }
}

type ConfigPath = Path<Config>
// Type: "server" | "database" | "server.host" | "server.port" | "database.url"
```

---

## Advanced Patterns

### Pattern 1: Type-Safe Event Emitter

```typescript
type EventMap = {
  'user:created': { id: string; name: string }
  'user:updated': { id: string }
  'user:deleted': { id: string }
}

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>
  } = {}

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(callback)
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const callbacks = this.listeners[event]
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }
}

const emitter = new TypedEventEmitter<EventMap>()
emitter.on('user:created', (data) => {
  console.log(data.id, data.name) // Type-safe!
})
```

### Pattern 2: Deep Readonly/Partial

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P]
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : DeepPartial<T[P]>
    : T[P]
}

interface Config {
  server: {
    host: string
    port: number
    ssl: {
      enabled: boolean
      cert: string
    }
  }
}

type ReadonlyConfig = DeepReadonly<Config>
type PartialConfig = DeepPartial<Config>
```

### Pattern 3: Discriminated Unions

```typescript
type Success<T> = { status: 'success'; data: T }
type Error = { status: 'error'; error: string }
type Loading = { status: 'loading' }

type AsyncState<T> = Success<T> | Error | Loading

function handleState<T>(state: AsyncState<T>): void {
  switch (state.status) {
    case 'success':
      console.log(state.data) // Type: T
      break
    case 'error':
      console.log(state.error) // Type: string
      break
    case 'loading':
      console.log('Loading...')
      break
  }
}
```

---

## Type Inference Techniques

### infer Keyword

```typescript
// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : never
type Num = ElementType<number[]> // number

// Extract promise type
type PromiseType<T> = T extends Promise<infer U> ? U : never
type AsyncNum = PromiseType<Promise<number>> // number

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never
function foo(a: string, b: number) {}
type FooParams = Parameters<typeof foo> // [string, number]
```

### Assertion Functions

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string')
  }
}

function processValue(value: unknown) {
  assertIsString(value)
  // value is now typed as string
  console.log(value.toUpperCase())
}
```

---

## Type Testing

```typescript
// Type assertion tests
type AssertEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false

type Test1 = AssertEqual<string, string> // true
type Test2 = AssertEqual<string, number> // false

// Expect error helper
type ExpectError<T extends never> = T
```

---

## Performance Considerations

- Avoid deeply nested conditional types
- Use simple types when possible
- Cache complex type computations
- Limit recursion depth in recursive types
- Use build tools to skip type checking in production

---

## Common Pitfalls

| Pitfall                       | Solution                          |
| ----------------------------- | --------------------------------- |
| Over-using `any`              | Use `unknown` or specific types   |
| Ignoring strict null checks   | Enable strict mode                |
| Too complex types             | Simplify and document             |
| Missing discriminated unions  | Use literal types for narrowing   |
| Forgetting readonly modifiers | Add readonly to prevent mutations |
| Circular type references      | Restructure or use interfaces     |
| Not handling edge cases       | Consider null, undefined, empty   |

---

## Related Documents

| Document                                              | Purpose                            |
| ----------------------------------------------------- | ---------------------------------- |
| [frontend/type-safety.md](../frontend/type-safety.md) | Astro/React-specific type patterns |
| [shared/code-quality.md](./code-quality.md)           | Code quality standards             |
| [shared/timestamp.md](./timestamp.md)                 | Timestamp type specifications      |

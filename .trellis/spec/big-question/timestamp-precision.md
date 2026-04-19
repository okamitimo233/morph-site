# Investigation: Timestamp Precision Mismatch

> **Category**: Deep-dive Technical Investigation
> **Severity**: P1 - Data sync fails, validation errors
> **Discovered**: During API integration

---

## Problem Statement

API requests fail with authentication or validation errors. Server logs show timestamps being parsed as dates from 1970:

```
Received timestamp: 1749710629
Parsed as: 1970-01-21T05:41:50.629Z  // Wrong!
Expected: 2025-06-12T10:43:49.000Z  // Correct
```

The timestamp `1749710629` is in **seconds**, but `new Date()` expects **milliseconds**.

---

## Root Cause: Drizzle ORM Timestamp Modes

Drizzle ORM's SQLite integer columns have two timestamp modes:

```typescript
// Stores as SECONDS
createdAt: integer('createdAt', { mode: 'timestamp' });

// Stores as MILLISECONDS
createdAt: integer('createdAt', { mode: 'timestamp_ms' });
```

The default behavior and JavaScript's expectations don't match:

| System                   | Uses                     |
| ------------------------ | ------------------------ |
| `mode: "timestamp"`      | Seconds (Unix timestamp) |
| `mode: "timestamp_ms"`   | Milliseconds             |
| JavaScript `Date.now()`  | Milliseconds             |
| JavaScript `new Date(n)` | Expects milliseconds     |

---

## Solution

### 1. Update Schema to Use Milliseconds

```typescript
// Before (seconds)
export const myTable = sqliteTable('myTable', {
  id: text('id').primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
});

// After (milliseconds)
export const myTable = sqliteTable('myTable', {
  id: text('id').primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }),
});
```

### 2. Create Data Migration

Since both modes use SQLite `INTEGER`, Drizzle CLI won't generate a migration automatically. Create one manually:

```sql
-- drizzle/migrations/0002_timestamp_to_ms.sql

-- Convert seconds to milliseconds (multiply by 1000)
-- Condition ensures idempotency: only convert if still in seconds
UPDATE myTable SET createdAt = createdAt * 1000
WHERE createdAt IS NOT NULL AND createdAt < 10000000000;

UPDATE myTable SET updatedAt = updatedAt * 1000
WHERE updatedAt IS NOT NULL AND updatedAt < 10000000000;
```

### 3. Update Migration Journal

```json
// drizzle/meta/_journal.json
{
  "entries": [
    { "idx": 0, "tag": "0000_initial" },
    { "idx": 1, "tag": "0001_some_change" },
    { "idx": 2, "tag": "0002_timestamp_to_ms" } // Add this
  ]
}
```

---

## Why the Condition `< 10000000000`?

```
Seconds timestamp (2025):     1749710629      (10 digits)
Milliseconds timestamp:       1749710629000   (13 digits)

If value < 10000000000, it's definitely seconds
If value >= 10000000000, it might already be milliseconds
```

This makes the migration **idempotent** - running it twice won't corrupt data.

---

## Key Insights

### 1. Drizzle's Mode Option is Easy to Miss

The documentation doesn't prominently warn about this difference. Always check:

```typescript
{
  mode: 'timestamp';
} // Seconds - probably not what you want
{
  mode: 'timestamp_ms';
} // Milliseconds - matches JavaScript
```

### 2. Drizzle Won't Auto-Generate Mode Migrations

Because the SQLite column type doesn't change (`INTEGER` in both cases), Drizzle kit doesn't detect the change. You must:

1. Manually create migration SQL
2. Manually update the journal

### 3. Test Timestamp Round-Trips

```typescript
// Test helper
function testTimestamp(table: string) {
  const now = new Date();
  const nowMs = now.getTime();

  // Insert
  db.insert(myTable).values({ createdAt: now }).run();

  // Read back
  const row = db.select().from(myTable).get();

  // Verify precision preserved
  expect(row.createdAt.getTime()).toBe(nowMs);
}
```

---

## Prevention

When defining new schemas with timestamps:

- [ ] Always use `mode: "timestamp_ms"` for timestamp columns
- [ ] Document the precision in schema comments
- [ ] Add tests for timestamp round-trips
- [ ] Verify API contracts match (ISO string vs milliseconds)

---

## Related Specifications

| Document | Purpose |
|----------|---------|
| [shared/timestamp.md](../shared/timestamp.md) | Timestamp format specification (authoritative) |
| [guides/semantic-change-checklist.md](../guides/semantic-change-checklist.md) | Changing data semantics safely |

---

**Language**: All documentation must be written in **English**.

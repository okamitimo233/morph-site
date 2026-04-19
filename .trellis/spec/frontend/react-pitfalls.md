# React Pitfalls & Common Mistakes

> Critical React patterns that cause bugs if not followed.

---

## Storing Functions in useState

**CRITICAL**: When storing a function in React state, you MUST wrap it in an arrow function.

React's `useState` setter interprets function arguments as "updater functions" and executes them immediately.

```tsx
// WRONG - React will EXECUTE handler immediately!
const [callback, setCallback] = useState<(() => void) | null>(null);
setCallback(myFunction); // myFunction(prevState) is called!

// CORRECT - Wrap in arrow function to store as value
setCallback(() => myFunction); // myFunction is stored, not called
```

> **Deep dive**: See [big-question/react-usestate-function.md](../big-question/react-usestate-function.md) for root cause analysis, symptoms, and complete solutions.

---

## Object/Date Stability in Hook Dependencies

**CRITICAL**: When passing objects or Date values to hooks, you MUST ensure reference stability using `useMemo`.

React's dependency comparison uses reference equality (`===`). Functions that create new objects (like `new Date()`) return different references on every render, causing infinite re-render loops.

```tsx
// WRONG - Creates new Date objects every render -> infinite loop
const [timeRange, setTimeRange] = useState<TimeRangeOption>('all');
const { dateFrom, dateTo } = getDateRangeFromOption(timeRange); // new Date() inside!

useMyData({ dateFrom, dateTo }); // Dependencies change -> refetch -> re-render -> repeat

// CORRECT - useMemo stabilizes the reference
const { dateFrom, dateTo } = useMemo(
  () => getDateRangeFromOption(timeRange),
  [timeRange] // Only recalculate when timeRange actually changes
);

useMyData({ dateFrom, dateTo }); // Stable references, no infinite loop
```

**When to use useMemo for hook dependencies:**

| Scenario                                         | Need useMemo? |
| ------------------------------------------------ | ------------- |
| Primitive values (`string`, `number`, `boolean`) | No            |
| Objects/arrays created inline                    | Yes           |
| Date objects                                     | Yes           |
| Results from functions that return new objects   | Yes           |
| Stable references (from useState, useRef)        | No            |

---

## State Lifecycle & Component Unmounting

**Problem**: State is lost when navigating between views because components get unmounted.

**Common scenario**:

```tsx
// Bad - TreeView's expandedIds state is lost when switching to editor
function MyPage() {
  const [editingItem, setEditingItem] = useState(null);

  if (editingItem) {
    return <ItemEditor item={editingItem} />; // TreeView unmounts here!
  }

  return <TreeView />; // Remounts with fresh state when returning
}
```

**Solution**: Lift state to a component that doesn't unmount:

```tsx
// Good - expandedIds persists because MyPage never unmounts
function MyPage() {
  const [editingItem, setEditingItem] = useState(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (editingItem) {
    return <ItemEditor item={editingItem} />;
  }

  return (
    <TreeView
      expandedIds={expandedIds} // Controlled mode
      onExpandedIdsChange={setExpandedIds}
    />
  );
}
```

**State Lifecycle Decision Matrix:**

| Lifecycle           | When to use                                  | How to implement                    |
| ------------------- | -------------------------------------------- | ----------------------------------- |
| **Component-level** | Form inputs, temp UI state                   | `useState` inside component         |
| **Page-level**      | Expand/collapse, scroll position, selections | Lift to parent that doesn't unmount |
| **Session-level**   | User preferences, last viewed item           | `localStorage` or Electron store    |

---

## Loading State Patterns (Avoiding Flash of Loading)

**Problem**: Showing loading skeleton on every data fetch causes UI flicker, especially on refetch after user actions.

**Good pattern**: Distinguish initial load vs background refresh:

```tsx
// Good - Only show skeleton on initial load
const [isLoading, setIsLoading] = useState(true); // Initial load
const [isRefetching, setIsRefetching] = useState(false); // Background refresh

const fetchData = async (isRefetch = false) => {
  if (isRefetch) {
    setIsRefetching(true); // Silent refresh, keep showing data
  } else {
    setIsLoading(true); // Show skeleton only on initial load
  }

  try {
    const data = await api.getData();
    setData(data);
  } finally {
    setIsLoading(false);
    setIsRefetching(false);
  }
};

// Expose separate refetch function
const refetch = () => fetchData(true);
```

**When to show loading skeleton:**

| Scenario                      | Show skeleton? | Why                                         |
| ----------------------------- | -------------- | ------------------------------------------- |
| Initial page load             | Yes            | User expects to wait for first load         |
| Refetch after edit/delete     | No             | Keep showing existing data, update silently |
| Refetch after navigation back | No             | User expects to see what they left          |
| Pull-to-refresh (mobile)      | Spinner only   | Show refresh indicator, not full skeleton   |
| Pagination / load more        | Partial        | Only show loading for new items             |

---

## useChat Hook ID Change Causes State Reset

**CRITICAL**: When using chat hooks (like Vercel AI SDK's `useChat`) with a dynamic `id` prop, changing the `id` will cause the hook to reinitialize and **clear all messages**.

This creates a race condition when loading chat history.

```tsx
// WRONG - Race condition: setMessages is called but then useChat resets
const { messages, setMessages } = useChat({
  id: currentChat?.id, // When this changes, hook reinitializes
});

const handleSelectChat = async (chat: Chat) => {
  const result = await api.getChat(chat.id);
  setCurrentChat(result.chat); // 1. Triggers useChat to reset
  setMessages(result.messages); // 2. Messages set but immediately cleared by reset!
};
```

```tsx
// CORRECT - Use ref + useEffect to set messages AFTER hook reinitializes
const pendingMessagesRef = useRef<Message[] | null>(null);

const { messages, setMessages } = useChat({
  id: currentChat?.id,
});

const handleSelectChat = async (chat: Chat) => {
  const result = await api.getChat(chat.id);
  pendingMessagesRef.current = result.messages; // 1. Store messages
  setCurrentChat(result.chat); // 2. Trigger hook reset
};

// 3. Apply messages after hook reinitializes
useEffect(() => {
  if (pendingMessagesRef.current !== null) {
    setMessages(pendingMessagesRef.current);
    pendingMessagesRef.current = null;
  }
}, [currentChat?.id, setMessages]);
```

**General rule for hooks with ID props:**
When a hook uses an `id` to manage state, assume the state resets on `id` change. Use refs + effects to apply state after the reset.

---

## Summary: Quick Reference

| Pitfall                       | Symptom                                       | Fix                            |
| ----------------------------- | --------------------------------------------- | ------------------------------ |
| Function in useState          | State resets, functions execute at wrong time | Wrap with `() =>`              |
| Object/Date in dependencies   | Infinite loops, endless API calls             | Use `useMemo`                  |
| State in unmounting component | State lost on navigation                      | Lift state to parent           |
| Loading on every fetch        | UI flickers                                   | Distinguish initial vs refetch |
| Hook ID change                | State cleared, race conditions                | Use ref + useEffect            |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [big-question/react-usestate-function.md](../big-question/react-usestate-function.md) | Deep dive: useState function storage issue |
| [guides/bug-root-cause-thinking-guide.md](../guides/bug-root-cause-thinking-guide.md) | Bug analysis methodology |
| [shared/code-quality.md](../shared/code-quality.md) | Code quality standards |

---

**Language**: All documentation must be written in **English**.

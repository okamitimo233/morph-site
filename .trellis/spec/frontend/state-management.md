# State Management

> Context, state patterns, and data fetching for Astro + React applications.

---

## State Philosophy in Astro

Astro's Islands architecture means each interactive component (island) has its own isolated state. Unlike traditional SPAs, there's no global state that persists across the entire application.

**Key principle**: Minimize state. Only hydrate what needs interactivity.

---

## Authentication State

Use React Context for auth state within authenticated islands:

```tsx
// src/features/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// ============================================
// Types
// ============================================

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextValue | null>(null)

// ============================================
// Provider
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return { success: true }
      }

      const error = await response.json()
      return { success: false, error: error.message }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Usage in an Island

```astro
---
// src/pages/dashboard.astro
import { AuthProvider } from '../features/auth/AuthContext';
import DashboardContent from '../components/islands/DashboardContent';
---

<AuthProvider>
  <DashboardContent client:load />
</AuthProvider>
```

---

## UI State (Sidebars, Modals)

For UI state like sidebar visibility, use React state within the component:

```tsx
// src/components/islands/Sidebar.tsx
import { useState, useCallback } from 'react'

interface SidebarProps {
  defaultOpen?: boolean
}

export default function Sidebar({ defaultOpen = true }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [width, setWidth] = useState(240)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <aside
      className={`transition-all duration-200 ${isOpen ? 'w-[var(--sidebar-width)]' : 'w-0'}`}
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      {/* Sidebar content */}
      <button onClick={toggle}>Toggle</button>
    </aside>
  )
}
```

### Persistence with localStorage

```tsx
// Persist sidebar state
import { useState, useEffect } from 'react'

export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as const
}

// Usage
function Sidebar() {
  const [isOpen, setIsOpen] = usePersistedState('sidebar-open', true)
  // ...
}
```

---

## Data Fetching

### Using fetch in React Components

```tsx
// src/components/islands/UserList.tsx
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Server-Side Data in Astro

For data that doesn't need interactivity, fetch on the server:

```astro
---
// src/pages/blog.astro
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();
---

<ul>
  {posts.map((post) => (
    <li>{post.title}</li>
  ))}
</ul>
```

---

## Form State

### React Hook Form (Recommended)

```tsx
// src/components/islands/ContactForm.tsx
import { useForm } from 'react-hook-form'

interface ContactForm {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      alert('Message sent!')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name', { required: 'Name is required' })} placeholder="Name" />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

---

## State Organization Summary

| State Type          | Where to Store       | Persistence               |
| ------------------- | -------------------- | ------------------------- |
| Auth state          | `AuthContext`        | Server session            |
| UI state (sidebars) | Component state      | `localStorage` (optional) |
| Form inputs         | `react-hook-form`    | None                      |
| Server data         | Astro frontmatter    | N/A (server-rendered)     |
| Client data         | `useState` + `fetch` | None                      |
| Animation state     | GSAP + `useRef`      | None                      |

---

## Cross-Island Communication

For communication between islands, use:

1. **URL state** - Share state via URL params
2. **Custom events** - Use browser events
3. **Shared context** - Wrap multiple islands in same provider

### URL State

```tsx
// Both islands can read/write URL params
import { useSearchParams } from 'react-router-dom'

function FilterIsland() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <select value={category} onChange={(e) => setSearchParams({ category: e.target.value })}>
      <option value="all">All</option>
      <option value="tech">Tech</option>
    </select>
  )
}
```

### Custom Events

```tsx
// Island 1: Dispatch event
function SearchInput() {
  const handleSearch = (query: string) => {
    window.dispatchEvent(new CustomEvent('search', { detail: query }))
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}

// Island 2: Listen for event
function SearchResults() {
  const [results, setResults] = useState([])

  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      fetchResults(e.detail).then(setResults)
    }

    window.addEventListener('search', handleSearch as EventListener)
    return () => window.removeEventListener('search', handleSearch as EventListener)
  }, [])

  return <ResultsList results={results} />
}
```

---

**Language**: All documentation must be written in **English**.

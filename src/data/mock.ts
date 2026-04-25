/**
 * Mock Data
 *
 * Sample data for development and testing.
 * In production, this would be replaced with real data from a CMS or API.
 */

/**
 * Article interface for blog posts
 */
export interface Article {
  /** Unique identifier */
  id: string
  /** Article title */
  title: string
  /** Short description/excerpt */
  excerpt: string
  /** Publication date */
  date: string
  /** Reading time in minutes */
  readingTime: number
  /** Cover image URL */
  coverImage: string
  /** Article category */
  category: string
  /** Tags for the article */
  tags: string[]
  /** Whether this is a featured article */
  featured?: boolean
}

/**
 * Sample articles for the blog
 */
export const articles: Article[] = [
  {
    id: 'building-scalable-react-apps',
    title: 'Building Scalable React Applications',
    excerpt:
      'Learn the architectural patterns and best practices for building React applications that scale gracefully as your team and codebase grow.',
    date: '2024-01-15',
    readingTime: 12,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    category: 'Development',
    tags: ['React', 'Architecture', 'TypeScript'],
    featured: true,
  },
  {
    id: 'modern-css-techniques',
    title: 'Modern CSS Techniques You Should Know',
    excerpt:
      'Explore the latest CSS features including container queries, cascade layers, and the :has() selector that are changing how we style the web.',
    date: '2024-01-10',
    readingTime: 8,
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
    category: 'CSS',
    tags: ['CSS', 'Frontend', 'Web Development'],
    featured: true,
  },
  {
    id: 'typescript-best-practices-2024',
    title: 'TypeScript Best Practices for 2024',
    excerpt:
      'A comprehensive guide to writing clean, maintainable TypeScript code with the latest features and patterns recommended by the community.',
    date: '2024-01-05',
    readingTime: 15,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    category: 'TypeScript',
    tags: ['TypeScript', 'Best Practices', 'Code Quality'],
    featured: true,
  },
  {
    id: 'astro-performance-optimization',
    title: 'Performance Optimization in Astro',
    excerpt:
      'Deep dive into Astro performance optimization techniques including islands architecture, partial hydration, and build-time rendering strategies.',
    date: '2023-12-28',
    readingTime: 10,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    category: 'Astro',
    tags: ['Astro', 'Performance', 'Web Development'],
    featured: true,
  },
  {
    id: 'animation-with-gsap',
    title: 'Creating Delightful Animations with GSAP',
    excerpt:
      'Master the art of web animations using GSAP. From simple transitions to complex timeline sequences and scroll-triggered animations.',
    date: '2023-12-20',
    readingTime: 14,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    category: 'Animation',
    tags: ['GSAP', 'Animation', 'JavaScript'],
    featured: true,
  },
]

/**
 * Get featured articles for the carousel
 */
export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured)
}

/**
 * Get recent articles (sorted by date, newest first)
 */
export function getRecentArticles(limit = 6): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

/**
 * Project interface for personal projects
 */
export interface Project {
  /** Unique identifier */
  id: string
  /** Project name */
  title: string
  /** Short description */
  description: string
  /** Detailed description */
  details?: string
  /** Project cover image */
  coverImage: string
  /** Technologies used */
  technologies: string[]
  /** Project URL */
  url?: string
  /** GitHub repository URL */
  github?: string
  /** Whether this is a featured project */
  featured?: boolean
  /** Year completed */
  year: number
  /** Project status */
  status: 'completed' | 'in-progress' | 'archived'
}

/**
 * Sample projects for showcase
 */
export const projects: Project[] = [
  {
    id: 'morph-blog',
    title: 'Morph Blog',
    description:
      'A modern personal blog built with Astro, React, and Tailwind CSS featuring a beautiful design system with dark mode support.',
    details:
      'This blog showcases a comprehensive design system with custom animations, responsive layouts, and an islands architecture for optimal performance.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    technologies: ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP'],
    url: 'https://morph-blog.dev',
    github: 'https://github.com/username/morph-blog',
    featured: true,
    year: 2024,
    status: 'in-progress',
  },
  {
    id: 'design-system',
    title: 'Component Library',
    description:
      'A comprehensive React component library with accessibility-first design and full TypeScript support.',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    technologies: ['React', 'TypeScript', 'Storybook', 'Jest'],
    github: 'https://github.com/username/component-lib',
    featured: true,
    year: 2024,
    status: 'completed',
  },
  {
    id: 'api-toolkit',
    title: 'API Toolkit',
    description:
      'A collection of utilities for building robust REST APIs with Node.js, including validation, authentication, and rate limiting.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    technologies: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL'],
    github: 'https://github.com/username/api-toolkit',
    featured: true,
    year: 2023,
    status: 'completed',
  },
  {
    id: 'task-manager',
    title: 'Task Manager Pro',
    description:
      'A full-featured task management application with real-time collaboration, notifications, and team workspaces.',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io'],
    url: 'https://task-manager-pro.app',
    year: 2023,
    status: 'completed',
  },
  {
    id: 'cli-dashboard',
    title: 'CLI Dashboard',
    description:
      'A beautiful terminal dashboard for monitoring system resources, git repositories, and todo lists.',
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop',
    technologies: ['Rust', 'TUI', 'System APIs'],
    github: 'https://github.com/username/cli-dashboard',
    year: 2023,
    status: 'archived',
  },
  {
    id: 'portfolio-v1',
    title: 'Portfolio v1',
    description:
      'My first portfolio website built with vanilla JavaScript and CSS, showcasing early projects and experiments.',
    coverImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    year: 2022,
    status: 'archived',
  },
]

/**
 * Get featured projects for the homepage
 */
export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}

/**
 * Get all projects sorted by year (newest first)
 */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year)
}

/**
 * Get projects by status
 */
export function getProjectsByStatus(status: Project['status']): Project[] {
  return projects.filter((project) => project.status === status)
}

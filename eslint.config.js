import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import astroPlugin from 'eslint-plugin-astro'
import astroParser from 'astro-eslint-parser'

export default [
  // Global ignores
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      '*.config.js',
      '*.config.mjs',
      '.agents/', // Agent skill scripts
      '.trellis/.backup*/', // Trellis backup directories
    ],
  },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript base
  ...tseslint.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/no-non-null-assertion': 'error',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Astro files
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astroPlugin,
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: {
          // Use TypeScript parser for frontmatter
          ts: tseslint.parser,
          js: tseslint.parser,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Astro: 'readonly',
      },
    },
    rules: {
      // Astro rules
      'astro/no-set-html-directive': 'error',
      'astro/no-unused-css-selector': 'warn',

      // Relax TypeScript rules for Astro frontmatter
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]

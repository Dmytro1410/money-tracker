import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import { defineConfig, globalIgnores } from 'eslint/config'

const compat = new FlatCompat()

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'sort-destructure-keys': sortDestructureKeys,
    },
    extends: [
      ...compat.extends('airbnb', 'airbnb/hooks'),
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
    rules: {
      // React 17+ — no need to import React for JSX
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Allow .tsx extension for JSX
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      // TypeScript handles prop-types
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      // Allow named exports alongside default exports
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      // Disable all jsx-a11y rules
      ...Object.fromEntries(
        Object.keys((await import('eslint-plugin-jsx-a11y')).default.rules).map(r => [`jsx-a11y/${r}`, 'off'])
      ),
      // Sort destructured keys (function params, object destructuring)
      'sort-destructure-keys/sort-destructure-keys': ['error', { caseSensitive: false }],
      // Sort JSX props alphabetically
      'react/jsx-sort-props': ['error', {
        callbacksLast: true,
        shorthandFirst: true,
        reservedFirst: true,
      }],
    },
  },
])

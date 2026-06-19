const js = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const jestPlugin = require('eslint-plugin-jest')
const jsoncPlugin = require('eslint-plugin-jsonc')
const globals = require('globals')

module.exports = [
  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended (flat)
  ...tsPlugin.configs['flat/recommended'],

  // React recommended (flat) — static version string avoids context.getFilename() bug in eslint-plugin-react@7 with eslint 10
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: { version: '18' },
    },
  },

  // Main config for all files
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin,
    },

    settings: {
      react: { version: '18' },
    },

    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'default-param-last': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/display-name': [0, { ignoreTranspilerName: false }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-restricted-types': [
        'warn',
        {
          types: {
            unknown:
              'Avoid using the unknown top-type. Prefer a concrete type, a typed helper wrapper, or a validated domain-specific type instead.',
          },
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/static-components': 'error',
      'react-hooks/component-hook-factories': 'error',
      'react-hooks/incompatible-library': 'error',
      'react-hooks/error-boundaries': 'error',
      'react-hooks/globals': 'error',
    },
  },

  // JS/JSX files — disable prop-types
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },

  // TS/TSX files — disable prop-types
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },

  // Jest for test files
  {
    files: ['**/__tests__/**/*.{ts,tsx,js,jsx}', '**/*.{test,spec}.{ts,tsx,js,jsx}'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      ...jestPlugin.configs['flat/style'].rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  // CommonJS / config files — also add Node/CommonJS globals here.
  {
    files: ['**/*.cjs', 'config/**/*.{js,cjs,mjs,ts}', '**/*.config.{js,cjs,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Node globals for test files
  {
    files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
  },

  // Restricted imports for app/plugin source (excluding test files and special files)
  {
    files: ['app/**/*.{ts,tsx}', 'plugins/**/*.{ts,tsx}'],
    ignores: [
      'app/cedarling/**/*',
      '**/__tests__/**/*',
      '**/*.test.ts',
      '**/*.test.tsx',
      'app/utils/RouteLoader.tsx',
      'plugins/**/plugin-metadata.ts',
      'plugins/**/plugin-metadata.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/cedarling',
              message:
                'Import Cedarling leaf modules directly, for example "@/cedarling/hooks/useCedarling" or "@/cedarling/utility", to preserve Fast Refresh boundaries.',
            },
            {
              name: '@mui/styles',
              message:
                '@mui/styles is deprecated. Use @mui/material/styles (or tss-react) instead.',
            },
            {
              name: 'lodash',
              message:
                "Don't barrel-import lodash — it pulls the whole library into the bundle. Import the method directly, e.g. import cloneDeep from 'lodash/cloneDeep'.",
            },
            {
              name: '@mui/icons-material',
              message:
                "Don't barrel-import @mui/icons-material — it re-exports thousands of icons. Import the icon directly, e.g. import Add from '@mui/icons-material/Add'.",
            },
            {
              name: '@mui/lab',
              message:
                "Don't barrel-import @mui/lab. Import the component directly, e.g. import LoadingButton from '@mui/lab/LoadingButton'.",
            },
            {
              name: '@mui/x-date-pickers',
              message:
                "Don't barrel-import @mui/x-date-pickers. Import the component/adapter directly, e.g. import { DatePicker } from '@mui/x-date-pickers/DatePicker'.",
            },
            {
              name: '@mui/x-date-pickers-pro',
              message:
                "Don't barrel-import @mui/x-date-pickers-pro. Import the component/adapter directly, e.g. import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'.",
            },
            {
              name: '@mui/x-data-grid',
              message:
                "Don't barrel-import @mui/x-data-grid. Import the component directly, e.g. import { DataGrid } from '@mui/x-data-grid/DataGrid'.",
            },
            {
              name: '@mui/x-data-grid-pro',
              message:
                "Don't barrel-import @mui/x-data-grid-pro. Import the component directly, e.g. import { DataGridPro } from '@mui/x-data-grid-pro/DataGridPro'.",
            },
            {
              name: '@mui/x-data-grid-premium',
              message:
                "Don't barrel-import @mui/x-data-grid-premium. Import the component directly, e.g. import { DataGridPremium } from '@mui/x-data-grid-premium/DataGridPremium'.",
            },
          ],
          patterns: [
            {
              group: [
                '**/routes/Dashboards/DashboardPage',
                '**/routes/Apps/Profile/ProfilePage',
                '**/routes/Apps/Gluu/Gluu404Error',
                '**/routes/Pages/ByeBye',
                '**/routes/Apps/Gluu/GluuNavBar',
                '**/layout/components/DefaultSidebar',
                '**/routes/Apps/Gluu/GluuToast',
                '**/routes/Apps/Gluu/GluuWebhookExecutionDialog',
              ],
              message:
                'Do not statically import lazy route modules. Load them only through app/utils/RouteLoader.tsx to keep HMR stable.',
            },
          ],
        },
      ],
    },
  },

  // JSON / JSONC linting
  ...jsoncPlugin.configs['flat/recommended-with-jsonc'],
  ...jsoncPlugin.configs['flat/recommended-with-json'],
  {
    files: ['**/*.json', '**/*.jsonc'],
    rules: {
      // JSON string values legitimately contain NBSP and other whitespace
      // (e.g., French typography in locale files). The rule targets JS source.
      'no-irregular-whitespace': 'off',
    },
  },

  // Ignore build output, generated files, and any non-JS/TS payloads
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.generated.ts',
      'app/redux/api/backend/**',
      'jans_config_api_orval/**',
      'jans_config_api/**',
      '.check-all-out/**',
      '.fix-orval-enums-out/**',
      'package-lock.json',
    ],
  },
]

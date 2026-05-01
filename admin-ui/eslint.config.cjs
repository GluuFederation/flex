const js = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const jestPlugin = require('eslint-plugin-jest')
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
        ...globals.node,
        ...globals.commonjs,
      },
    },

    plugins: {
      'react': reactPlugin,
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
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            unknown: 'Avoid the top-type here; use a specific type or a documented union instead',
          },
        },
      ],
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
    files: ['**/__tests__/**/*.{ts,tsx,js}', '**/*.test.{ts,tsx,js}'],
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

  // CommonJS config files
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
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

  // Ignore build output and generated files
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.generated.ts',
      'app/redux/api/backend/**',
    ],
  },
]

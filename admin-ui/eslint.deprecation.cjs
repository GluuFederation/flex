const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const noDeprecatedImport = require('./script/eslint-rules/no-deprecated-import.cjs')

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'jans_config_api/**',
      'jans_config_api_orval/**',
    ],
  },
  {
    files: ['app/**/*.{ts,tsx}', 'plugins/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'local': { rules: { 'no-deprecated-import': noDeprecatedImport } },
    },
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
      'local/no-deprecated-import': 'error',
    },
  },
]

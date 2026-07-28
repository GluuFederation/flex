const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

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
    plugins: { '@typescript-eslint': tsPlugin },
    rules: { '@typescript-eslint/no-deprecated': 'error' },
  },
]

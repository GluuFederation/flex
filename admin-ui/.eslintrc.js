module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'jest', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Prettier handled rules - commented out to avoid conflicts
    // semi: ['error', 'never'],
    // 'no-multi-spaces': 'error',
    // 'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    // 'object-curly-spacing': ['error', 'always'],
    // 'react/jsx-curly-spacing': [0, 'always'],
    // 'generator-star-spacing': 'off',
    // 'space-in-parens': ['error', 'never'],
    // 'comma-spacing': ['error', { before: false, after: true }],
    // indent: ['error', 2, { ignoredNodes: ['JSXElement'], "SwitchCase": 1 }],
    // 'react/jsx-indent': ['error', 2],
    // 'react/jsx-indent-props': ['error', 2],
    'react/react-in-jsx-scope': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'default-param-last': 'off',
    //"no-use-before-define": "error",
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/display-name': [0, { ignoreTranspilerName: false }],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}

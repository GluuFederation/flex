module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  plugins: ['react', 'jest'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
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

    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off',
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
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
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

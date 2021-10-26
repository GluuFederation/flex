module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    'universal-import',
    'babel-plugin-styled-components',
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', 'jest'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
}

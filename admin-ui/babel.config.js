module.exports = {
presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-styled-components',
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-react",
          {
            runtime: "automatic",
          },
        ],
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
          },
        ],
        'jest'
      ],
      plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-transform-modules-commonjs"],
    },
  },
}

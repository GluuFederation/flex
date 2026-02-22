module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-styled-components',
  ],
  env: {
    test: {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        'jest',
      ],
      plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs'],
    },
  },
}

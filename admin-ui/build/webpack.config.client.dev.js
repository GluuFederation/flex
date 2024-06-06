const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const config = require('./../config')
require('dotenv').config({
  path: (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) || '.env.local',
})


const BASE_PATH = process.env.BASE_PATH || '/'
const CONFIG_API_BASE_URL =
  process.env.CONFIG_API_BASE_URL || 'https://sample.com'

module.exports = {
  name: 'client',
  optimization: {
    moduleIds: 'named',
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devtool: 'source-map',
  target: 'web',
  mode: 'development',
  entry: {
    app: [path.join(config.srcDir, 'index.js')],
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: config.distDir,
    publicPath: BASE_PATH,
  },
  resolve: {
    fallback: { querystring: false, crypto: false, util: false, console: false },
    modules: ['node_modules', config.srcDir],
    alias: {
      path: require.resolve('path-browserify'),
      Components: path.resolve(__dirname, '../app/components'),
      Context: path.resolve(__dirname, '../app/context'),
      Images: path.resolve(__dirname, '../app/images'),
      Plugins: path.resolve(__dirname, '../plugins'),
      Redux: path.resolve(__dirname, '../app/redux'),
      Routes: path.resolve(__dirname, '../app/routes'),
      Styles: path.resolve(__dirname, '../app/styles'),
      Utils: path.resolve(__dirname, '../app/utils'),
    },
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: process.cwd(),
      onDetected: ({ module, paths, compilation }) => {
        let warnings = []
        warnings.push(new Error(paths.join(' -> ')))
        if (warnings.length > 0) {
          warnings.forEach(error => error && console.warn(error.message));
        }
      },
    }),
    new HtmlWebpackPlugin({
      title: 'AdminUI',
      inject: 'body',
      template: config.srcHtmlLayout,
      favicon: path.resolve(__dirname, '../app/images/favicons/favicon.ico'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BASE_PATH: JSON.stringify(BASE_PATH),
        API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
        CONFIG_API_BASE_URL: JSON.stringify(CONFIG_API_BASE_URL),
      },
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          { loader: 'postcss-loader' },
          'sass-loader',
        ],
        exclude: [path.resolve(config.srcDir, 'styles')],
        include: [config.srcDir],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {},
          },
        ],
        include: [path.resolve(config.srcDir, 'styles')],
      },
      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          esModule: false,
        },
      },
      // Files
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]',
          esModule: false,
        },
      },
    ],
  },
  devServer: {
    client: {
      overlay: {
        runtimeErrors: false,
      },
    },
    hot: true,
    compress: true,
    historyApiFallback: {
      index: BASE_PATH,
    },
    host: '0.0.0.0',
    port: 4100,
  },
}

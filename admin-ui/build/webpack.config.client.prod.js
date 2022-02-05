const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

const config = require('./../config')
require('dotenv').config({
  path: (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) || '.env',
})

const BASE_PATH = process.env.BASE_PATH || '/admin'
const CONFIG_API_BASE_URL =
  process.env.CONFIG_API_BASE_URL || 'https://sample.com'
const API_BASE_URL =
  process.env.API_BASE_URL || 'https://bank.gluu.org/admin-ui-api'
const SESSION_TIMEOUT_IN_MINUTES = process.env.SESSION_TIMEOUT_IN_MINUTES || 2

module.exports = {
  devtool: false,
  mode: 'production',
  entry: {
    app: [path.join(config.srcDir, 'index.js')],
  },
  optimization: {
    moduleIds: 'named',
    chunkIds: 'named',
    minimize: false,
    nodeEnv: 'production',
    mangleWasmImports: true,
    removeEmptyChunks: false,
    mergeDuplicateChunks: false,
    flagIncludedChunks: true,
    minimizer: [`...`, new CssMinimizerPlugin(), '...'],
    emitOnErrors: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: config.distDir,
    publicPath: BASE_PATH,
  },
  resolve: {
    fallback: { "querystring": false },
    modules: ['node_modules', config.srcDir],
    alias: {
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
    new HtmlWebpackPlugin({
      template: config.srcHtmlLayout,
      inject: 'body',
      title: 'AdminUI',
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BASE_PATH: JSON.stringify(BASE_PATH),
        API_BASE_URL: JSON.stringify(API_BASE_URL),
        CONFIG_API_BASE_URL: JSON.stringify(CONFIG_API_BASE_URL),
        SESSION_TIMEOUT_IN_MINUTES: JSON.stringify(SESSION_TIMEOUT_IN_MINUTES),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [config.srcDir, config.pluginsDir],
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // Modular Styles
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {},
          },
        ],
        exclude: [path.resolve(config.srcDir, 'styles')],
        include: [config.srcDir],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
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
          name: '/fonts/[name].[ext]',
        },
      },
      // Files
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '/static/[name].[ext]',
        },
      },
    ],
  },
  devServer: {
    hot: false,
    //contentBase: config.distDir,
    compress: true,
    historyApiFallback: {
      index: BASE_PATH,
    },
    host: '0.0.0.0',
    port: 4100,
  },
}

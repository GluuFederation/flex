const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const config = require('./../config')
require('dotenv').config({
  path: (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) || '.env',
})
const BASE_PATH = process.env.BASE_PATH || '/admin'
const CONFIG_API_BASE_URL =
  process.env.CONFIG_API_BASE_URL || 'https://sample.com'
const API_BASE_URL =
  process.env.API_BASE_URL || 'https://bank.gluu.org/admin-ui-api'

module.exports = {
  devtool: false,
  mode: 'production',
  entry: {
    app: [path.join(config.srcDir, 'index.js')]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [`...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              calc: false,
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      `...`]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: config.distDir,
    publicPath: BASE_PATH,
  },
  resolve: {
    fallback: { "querystring": false, crypto: false, util: false, console: false },
    modules: ['node_modules', config.srcDir],
    alias: {
      path: require.resolve('path-browserify'),
      '@': path.resolve(__dirname, '../app'),
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
      template: config.srcHtmlLayout,
      inject: 'body',
      title: 'AdminUI',
      favicon: path.resolve(__dirname, '../app/images/favicons/favicon.ico'),
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BASE_PATH: JSON.stringify(BASE_PATH),
        API_BASE_URL: JSON.stringify(API_BASE_URL),
        CONFIG_API_BASE_URL: JSON.stringify(CONFIG_API_BASE_URL),
      },
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'disabled' }) //* switch mode to "server" to activate BundleAnalyzerPlugin
  ],
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.js$/,
        include: [config.srcDir, config.pluginsDir],
        exclude: /(node_modules|\.test\.js$)/,
        use: 'babel-loader',
        sideEffects: false,
      },
      {
        test: /\.test\.js$/,
        include: [config.srcDir, config.pluginsDir],
        use: 'ignore-loader',
      },
      // Modular Styles
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"]
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
          esModule: false,
        },
      },
      // Files
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '/static/[name].[ext]',
          esModule: false,
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

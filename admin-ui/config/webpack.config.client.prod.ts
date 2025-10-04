import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'
//import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import bundleAnalyzerConfig from './bundle-analyzer.config.js'
import type { PolicyStoreConfig } from './types/policy-store'
import config from './../config.js'
import dotenv from 'dotenv'
import type { Configuration as WebpackConfig } from 'webpack'
import type { Configuration as DevServerConfig } from 'webpack-dev-server'
import { readFileSync } from 'fs'

// Set __dirname to point to the config directory for file path resolution
const __dirname = path.join(process.cwd(), 'config')

dotenv.config({
  path: (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) || '.env',
})

const BASE_PATH = process.env.BASE_PATH || '/admin'
const CONFIG_API_BASE_URL = process.env.CONFIG_API_BASE_URL || 'https://sample.com'
const API_BASE_URL = process.env.API_BASE_URL || 'https://bank.gluu.org/admin-ui-api'

const prodPolicyStoreJson: PolicyStoreConfig = JSON.parse(
  readFileSync(path.resolve(__dirname, '../app/cedarling/config/policy-store-prod.json'), 'utf-8'),
)

const webpackConfig: WebpackConfig & { devServer?: DevServerConfig } = {
  devtool: false,
  mode: 'production',
  entry: {
    app: [path.join(config.srcDir, 'index.tsx')],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor libraries - split by framework/library type
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 20,
        },
        mui: {
          test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
          name: 'mui-vendor',
          chunks: 'all',
          priority: 19,
        },
        redux: {
          test: /[\\/]node_modules[\\/](@reduxjs|redux|redux-saga|redux-persist)[\\/]/,
          name: 'redux-vendor',
          chunks: 'all',
          priority: 18,
        },
        charts: {
          test: /[\\/]node_modules[\\/](recharts|react-ace|ace-builds)[\\/]/,
          name: 'charts-vendor',
          chunks: 'all',
          priority: 17,
        },
        utils: {
          test: /[\\/]node_modules[\\/](lodash|moment|dayjs|axios|formik|yup)[\\/]/,
          name: 'utils-vendor',
          chunks: 'all',
          priority: 16,
        },
        // Plugin chunks - each plugin gets its own chunk
        plugins: {
          test: /[\\/]plugins[\\/]/,
          name: (module: any) => {
            const pluginName = module.context.match(/[\\/]plugins[\\/]([^\\/]+)[\\/]/)?.[1]
            return pluginName ? `plugin-${pluginName}` : 'plugin-common'
          },
          chunks: 'all',
          priority: 15,
        },
        // Common vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10,
        },
        // Common application code
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
        },
      },
    },
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              calc: false,
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: config.distDir,
    publicPath: BASE_PATH,
  },
  resolve: {
    fallback: {
      querystring: false,
      crypto: false,
      util: false,
      console: false,
      path: 'path-browserify',
    },
    modules: ['node_modules', config.srcDir],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../app'),
      'Components': path.resolve(__dirname, '../app/components'),
      'Context': path.resolve(__dirname, '../app/context'),
      'Images': path.resolve(__dirname, '../app/images'),
      'Plugins': path.resolve(__dirname, '../plugins'),
      'Redux': path.resolve(__dirname, '../app/redux'),
      'Routes': path.resolve(__dirname, '../app/routes'),
      'Styles': path.resolve(__dirname, '../app/styles'),
      'Utils': path.resolve(__dirname, '../app/utils'),
    },
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: process.cwd(),
      onDetected: ({
        paths,
      }: {
        module: unknown
        paths: string[]
        compilation: webpack.Compilation
      }) => {
        const warnings: Error[] = []
        warnings.push(new Error(paths.join(' -> ')))
        if (warnings.length > 0) {
          warnings.forEach((error) => error && console.warn(error.message))
        }
      },
    }) as webpack.WebpackPluginInstance,
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
        POLICY_STORE_CONFIG: JSON.stringify(prodPolicyStoreJson),
      },
    }),
    ...bundleAnalyzerConfig.plugins,
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [config.srcDir, config.pluginsDir],
        exclude: /(node_modules|\.test\.(ts|tsx)$)/,
        use: 'babel-loader',
        sideEffects: false,
      },
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
        sideEffects: false,
      },
      // Modular Styles
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
    compress: true,
    historyApiFallback: {
      index: BASE_PATH,
    },
    host: '0.0.0.0',
    port: 4100,
  },
}

export default webpackConfig

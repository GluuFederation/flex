import path from 'path'
import webpack from 'webpack'
import type { Configuration as WebpackConfig } from 'webpack'
import type { Configuration as DevServerConfig } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import type { WebpackPluginInstance } from 'webpack'
import type { PolicyStoreConfig } from './types/policy-store'
import config from './../config.js'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

const __dirname = path.join(process.cwd(), 'config')

dotenv.config({
  path: (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) || '.env.local',
})

const BASE_PATH: string = process.env.BASE_PATH || '/'
const CONFIG_API_BASE_URL: string = process.env.CONFIG_API_BASE_URL || 'https://sample.com'

const devPolicyStoreJson: PolicyStoreConfig = JSON.parse(
  readFileSync(path.resolve(__dirname, '../app/cedarling/config/policy-store-dev.json'), 'utf-8'),
)

const webpackConfig: WebpackConfig & { devServer?: DevServerConfig } = {
  name: 'client',
  optimization: {
    moduleIds: 'named',
    minimizer: [`...`, new CssMinimizerPlugin()],
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
            const context = (module && module.context) || ''
            const match = context && context.match(/[\\/]plugins[\\/]([^\\/]+)[\\/]/)
            return match && match[1] ? `plugin-${match[1]}` : 'plugin-common'
          },
          chunks: 'all',
          priority: 15,
          reuseExistingChunk: true,
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
  },
  devtool: 'source-map',
  target: 'web',
  mode: 'development',
  entry: {
    app: [path.join(config.srcDir, 'index.tsx')],
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: config.distDir,
    publicPath: BASE_PATH,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      querystring: false,
      crypto: false,
      util: false,
      console: false,
      path: 'path-browserify',
      url: 'url/',
    },
    modules: ['node_modules', config.srcDir],
    alias: {
      '@': path.resolve(process.cwd(), 'app'),
      'Components': path.resolve(process.cwd(), 'app/components'),
      'Context': path.resolve(process.cwd(), 'app/context'),
      'Images': path.resolve(process.cwd(), 'app/images'),
      'JansConfigApi': path.resolve(process.cwd(), 'jans_config_api_orval/src/JansConfigApi.ts'),
      'Plugins': path.resolve(process.cwd(), 'plugins'),
      'Redux': path.resolve(process.cwd(), 'app/redux'),
      'Routes': path.resolve(process.cwd(), 'app/routes'),
      'Styles': path.resolve(process.cwd(), 'app/styles'),
      'Utils': path.resolve(process.cwd(), 'app/utils'),
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
    }) as WebpackPluginInstance,
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
        POLICY_STORE_CONFIG: JSON.stringify(devPolicyStoreJson),
      },
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [
          config.srcDir,
          config.pluginsDir,
          path.resolve(__dirname, '../jans_config_api_orval'),
          path.resolve(__dirname, '..'), // Include root directory for api-client.ts
        ],
        exclude: /(node_modules|\.test\.(ts|tsx)$)/,
        use: 'babel-loader',
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.js$/,
        exclude: /(?:node_modules|\.test\.js$)/,
        use: 'babel-loader',
      },
      {
        test: /\.test\.js$/,
        include: [config.srcDir, config.pluginsDir],
        use: 'ignore-loader',
        sideEffects: false,
      },
      {
        test: /\.test\.(ts|tsx)$/,
        include: [config.srcDir, config.pluginsDir],
        use: 'ignore-loader',
        sideEffects: false,
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
      disableDotRule: true,
      index: `${BASE_PATH}index.html`,
    },
    host: '0.0.0.0',
    port: 4100,
  },
}

export default webpackConfig

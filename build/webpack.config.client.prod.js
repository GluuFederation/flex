const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const config = require("./../config");
require("dotenv").config({
  path: (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) || ".env"
});

const BASE_PATH = process.env.BASE_PATH || "/";

module.exports = {
  devtool: "inline-source-map",
  mode: "production",
  entry: {
    app: [path.join(config.srcDir, "index.js")]
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    path: config.distDir,
    publicPath: BASE_PATH
  },
  resolve: {
    modules: ["node_modules", config.srcDir]
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd()
    }),
    new HtmlWebpackPlugin({
      template: config.srcHtmlLayout,
      inject: false,
      title: "AdminUI"
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractCssChunks(),
    new OptimizeCssAssetsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.BASE_PATH": JSON.stringify(BASE_PATH),
      "process.env.API_BASE_URL": JSON.stringify(process.env.API_BASE_URL)
    })
  ],
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [config.srcDir, config.pluginsDir],
        exclude: /node_modules/,
        use: "babel-loader"
      },
      // Modular Styles
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          { loader: "postcss-loader" }
        ],
        exclude: [path.resolve(config.srcDir, "styles")],
        include: [config.srcDir]
      },
      {
        test: /\.scss$/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          { loader: "postcss-loader" },
          {
            loader: "sass-loader",
            options: {
              includePaths: config.scssIncludes
            }
          }
        ],
        exclude: [path.resolve(config.srcDir, "styles")],
        include: [config.srcDir]
      },
      // Global Styles
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" }
        ],
        include: [path.resolve(config.srcDir, "styles")]
      },
      {
        test: /\.scss$/,
        use: [
          ExtractCssChunks.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          {
            loader: "sass-loader",
            options: {
              includePaths: config.scssIncludes
            }
          }
        ],
        include: [path.resolve(config.srcDir, "styles")]
      },
      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "/fonts/[name].[ext]"
        }
      },
      // Files
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        loader: "file-loader",
        options: {
          name: "/static/[name].[ext]"
        }
      }
    ]
  },
  devServer: {
    hot: false,
    contentBase: config.distDir,
    compress: true,
    historyApiFallback: {
      index: "/"
    },
    host: "0.0.0.0",
    port: 4100
  }
};

const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const webpack = require("webpack");

const buildMode = process.env.NODE_ENV === "production" ? "production" : "development"

module.exports = {
  mode: buildMode,
  entry: "./src/index.tsx",
  output: {
    path: `${__dirname}/dist`,
    filename: "[contenthash].bundle.js",
  },
  target: "web",
  node: {
    global: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader?modules", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_BASE_PATH: JSON.stringify(process.env.NODE_ENV === "production" ? "" : "http://localhost:8080")
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: "index.html",
    }),
    new MonacoWebpackPlugin(),
  ],
  devServer: {
    index: "index.html",
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    port: 7100,
    historyApiFallback: true,
  },
};
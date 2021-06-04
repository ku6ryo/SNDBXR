const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const buildMode = process.env.NODE_ENV === "production" ? "production" : "development"

module.exports = {
  mode: buildMode,
  entry: "./src/index.ts",
  output: {
    path: `${__dirname}/dist`,
    filename: "[contenthash].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader?modules", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: "index.html",
    })
  ],
  devServer: {
    index: "index.html",
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    port: 7000,
    historyApiFallback: true,
  },
};
const path = require("path")
const packageJson = require("./package.json")

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.ts",
  target: "web",
  mode: "production",
  module: {
    rules: [{
      test: /\.ts$/,
      use: "ts-loader",
      exclude: /node_modules/,
    }]
  },
  output: {
    filename: `connector.js`,
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  optimization: {
    minimize: true,
  },
}
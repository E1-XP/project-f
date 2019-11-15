const uglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["awesome-typescript-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".ts"]
  },
  plugins: [],
  optimization: {
    minimizer: [
      new uglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          },
          output: {
            comments: false
          }
        }
      })
    ]
  }
};

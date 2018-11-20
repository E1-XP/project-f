const htmlWebpackPlugin = require("html-webpack-plugin");
const uglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/public",
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["awesome-typescript-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "resolve-url-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "../",
            publicPath: "/public"
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".ts"]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ],
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
  },
  devServer: {
    contentBase: "./public"
  }
};

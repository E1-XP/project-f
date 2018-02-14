const path = require('path');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, "./dist/js"),
        filename: "bundle.js",
        publicPath: "/dist/js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    }
    //,
    // plugins: [
    //     new uglifyJsPlugin()
    // ]
};
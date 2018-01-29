const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PORT = 8082;
const extractCss = new ExtractTextPlugin('component.bundle.css');

module.exports = function getWebpackConfigs() {

    const config = {};

    config.resolve = {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            "@components": path.resolve(__dirname, "src")
        }
    }

    config.entry = {
        app: './docs/app.tsx'
    }

    config.output = {
        publicPath: `http://localhost:${PORT}/`,
        filename: '[name].js'
    }

    config.module = {
        rules: [{
            test: /\.(ts$|tsx$)/,
            use: [{
                loader: "ts-loader",
                options: {
                    configFile: path.resolve(__dirname, "tsconfig.json")
                }
            }]
        }, {
            test: /\.css$/,
            use: extractCss.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1, module: true, localIdentName: '[name]__[local]___[hash:base64:5]' }
                    },
                    "postcss-loader"
                ]
            })
        }, {
            test: /\.(png|jpg|jpeg|gif|json|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader'
        }]
    }

    config.plugins = [
        extractCss,

        new HtmlWebpackPlugin({
            template: './docs/index.html',
            inject: 'body'
        })
    ];

    config.devServer = {
        contentBase: '.',
        stats: 'minimal',
        port: PORT
    }

    return config;
}();
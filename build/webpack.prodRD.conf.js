'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const env = require('../config/prod.env')

module.exports = {
    entry: './src/redirect.js',
    output: {
        path: path.resolve(__dirname, '../redirectDist'),
        filename: 'static/js/redirect.[chunkhash:7].js',
        chunkFilename: 'static/js/redirect.[chunkhash:7].js'
    },

    module: {
        rules: [{
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new HtmlWebpackPlugin({
            filename: './redirect.html',
            template: './redirect.html',
            inject: true
        })
    ]
}
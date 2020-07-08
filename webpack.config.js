const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // specify the entry point for the project
    entry: ['./src/js/index.js'],
    // define the output property and we pass the object
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename:'js/bundle.js'
    },
    devServer:{
        contentBase: './dist'
    },
    // define the plugin
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }/*passing object as argument*/)
    ],
    // using loaders in webpack
    module:{
        // we set some rules for loaders as objects
        rules: [
            {
                // test property
                test: /\.js$/,// check for all files and check if they end with js
                // exclude the whole folder of node modules
                exclude: '/node_modules/',
                // All javascript object will use the babel loader
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
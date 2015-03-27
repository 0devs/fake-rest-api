var webpack = require('webpack');

module.exports = {
    resolve: {
        modulesDirectories: [
            'node_modules',
            'src'
        ]
    },

    entry: {
        app: "./src/web/app.js"
    },
    devtool: 'source-map',
    output: {
        path: "./public/static/app/",
        publicPath: "/public/static/app/",
        filename: '[name].bundle.min.js',
        chunkFilename: '[name].bundle.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/, loader: 'style!css'
            },
            {
                test: /\.html$/, loader: "html"
            },
            {
                test: /\.json$/, loader: 'json-loader'
            }
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            filename: 'init.js'
        })
    ]
};
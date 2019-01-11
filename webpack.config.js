const webpack = require('webpack'); 
const path = require('path');

module.exports = {
    entry:  {
      entry: path.resolve(__dirname, './src/entry.jsx')
    },
    output : {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build')
    },
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.(css)$/,
            use: ['style-loader', 'css-loader']
        },{
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        },{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015','react','stage-0']
                    }
                }
            ]
            
        }]
    }
}
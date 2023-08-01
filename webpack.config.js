const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
    entry: './src/main.js',
    mode: 'production',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true,
            extractComments: false,
            terserOptions: {
                compress: true,
                format: {
                    comments: false,
                },
            },
        })],
    },
};
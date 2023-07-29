module.exports = {
    entry: './src/main.js',
    mode: 'production',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
    },
};
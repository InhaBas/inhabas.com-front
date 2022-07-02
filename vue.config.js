module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://dev.inhabas.com',
                changeOrigin: true
            }
        }
    }
}

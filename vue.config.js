const path = require('path');
function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports = {
    outputDir: process.env.NODE_ENV === "ipfsview" ? 'ipfs_dist' : 'dist',
    publicPath: process.env.NODE_ENV === "ipfsview" ? '././' : '/',
    chainWebpack: (config)=> {
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('views', resolve('./src/views'))
            .set('img', resolve('./src/assets/images'))
            .set('assets', resolve('./src/assets'))
            .set('mixins', resolve('./src/mixins'))

        if (process.env.NODE_ENV !== "development") {
            config.optimization.splitChunks({
                    chunks: 'initial',
                    minSize: 30000,
                    minChunks: 1,
                    maxAsyncRequests: 4,
                    maxInitialRequests: 4,
                    name: true,
                    cacheGroups: {
                        default: {
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true
                        },
                        element: {
                            filename: '[name].[chunkhash].js',
                            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                            priority: 1
                        },
                        echart: {
                            chunks: 'all',
                            name: 'echart.min',
                            test: /[\\/]node_modules[\\/]echart/,
                            enforce: true
                        },
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            filename: '[name].[chunkhash].js',
                            priority: -1
                        }
                    }
                })
        }
    },
    devServer: {
        proxy: {
            '/api-home': {
                target: 'https://burgerswap.org',
                pathRewrite: {'^/api-home': ''}
            },
            '/apis': {
                target: 'https://api-test.burgerswap.org',
                pathRewrite: {'^/apis': ''}
            },
            '/info-apis': {
                target: 'https://info.burgerswap.org',
                pathRewrite: {'^/info-apis': ''}
            },
            // '/api': {
            //     target: 'https://api.binance.com',
            //     pathRewrite: {'^/api': '/api'}
            // },  /api/v5/market/history-candles   //https://api.huobi.pro/market/
            // '/api': {
            //     target: 'https://www.okex.com',
            //     pathRewrite: {'^/api': '/api'}
            // },
            '/thirdkline/market': {
                target: 'https://api.huobi.pro',
                pathRewrite: {'^/thirdkline/market': '/market'}
            },

            // '/market': {
            //     target: 'https://api.huobi.pro',
            //     pathRewrite: {'^/market': '/market'}
            // },
            '/subgraphs': {
                target: 'https://info.burgerswap.org',
                pathRewrite: {'^/subgraphs': '/subgraphs'}
            },
        },
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require("postcss-plugin-px2rem")({
                        rootValue: 64,
                        // unitPrecision: 5,
                        //propWhiteList: [],
                        // propBlackList: [],
                        // exclude: /(node_module)/,
                        // selectorBlackList: [],
                        // ignoreIdentifier: false,
                        // replace: true,
                        mediaQuery: false,
                        minPixelValue: 3
                    })
                ]
            }
        }
    }
}

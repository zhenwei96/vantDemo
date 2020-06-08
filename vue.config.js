const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // 开启gzip压缩， 按需引用
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const IS_PROD = ['production'].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);
const os = require('os');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : './', // 公共路径
    indexPath: 'index.html', // 相对于打包路径index.html的路径
    outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: true, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: !IS_PROD, // 生产环境的 source map
    // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建
    parallel: os.cpus().length > 1,
    pwa: {}, // 向 PWA 插件传递选项。
    chainWebpack: config => {
        config.resolve.symlinks(true); // 修复热更新失效
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin('html').tap(args => {
            // 修复 Lazy loading routes Error
            const copyArgs = args;
            copyArgs[0].chunksSortMode = 'none';
            return copyArgs;
        });
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@components', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@store', resolve('src/store'));
        // 压缩图片
        // 需要 npm i -D image-webpack-loader
        // config.module
        //   .rule('images')
        //   .use('image-webpack-loader')
        //   .loader('image-webpack-loader')
        //   .options({
        //     mozjpeg: { progressive: true, quality: 65 },
        //     optipng: { enabled: false },
        //     pngquant: { quality: [0.65, 0.9], speed: 4 },
        //     // gifsicle: { interlaced: false },
        //     webp: { quality: 75 },
        //   });
        // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
        if (IS_PROD) {
            config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
                {
                    analyzerMode: 'static',
                },
            ]);
        }
        // const oneOfsMap = config.module.rule('scss').oneOfs.store;
        // oneOfsMap.forEach((item) => {
        //     item.use('sass-resources-loader')
        //         .loader('sass-resources-loader')
        //         .options({
        //             // Provide path to the file with resources
        //             // 要公用的scss的路径
        //             resources: resolve('src/assets/css/variables.scss'),
        //         })
        //         .end();
        // });
    },
    configureWebpack: config => {
        // 开启 gzip 压缩
        // 需要 npm i -D compression-webpack-plugin
        const plugins = [];
        const copyConfig = config;
        if (IS_PROD) {
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8,
                }),
            );
        }
        copyConfig.plugins = [...copyConfig.plugins, ...plugins];
    },
    css: {
        extract: IS_PROD,
        requireModuleExtension: true, // 去掉文件名中的 .module false 会导致vant没有样式
        loaderOptions: {
            // 给 less-loader 传递 Less.js 相关选项
            less: {
                // `globalVars` 定义全局对象，可加入全局变量
                globalVars: {
                    primary: '#333',
                },
            },
            scss: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.sass` 这个文件
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `@import "~@/assets/css/variables.scss";`,
            },
        },
    },
    devServer: {
        overlay: {
            // 让浏览器 overlay 同时显示警告和错误
            warnings: true,
            errors: true,
        },
        host: '0.0.0.0',
        port: 8080, // 端口号
        https: false, // https:{type:Boolean}
        open: false, // 配置自动启动浏览器
        hotOnly: true, // 热更新
        // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
        proxy: {
            // 配置多个跨域
            '/backend/api': {
                target: 'https://tea.chazhenxuan.com/v1/product/list/app',
                changeOrigin: true,
                // ws: true,//websocket支持
                secure: false,
                pathRewrite: {
                    '^/backend/api': '/',
                },
            },
            '/api2': {
                target: 'http://172.12.12.12:2018',
                changeOrigin: true,
                // ws: true,//websocket支持
                secure: false,
                pathRewrite: {
                    '^/api2': '/',
                },
            },
        },
    },
};

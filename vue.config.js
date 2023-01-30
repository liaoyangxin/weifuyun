const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

//添加版本号 此处用时间戳
const Timestamp = new Date().getTime() 
// 处理 css 时 引入MiniCssExtractPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
process.env.VUE_APP_Version = require('./package.json').version

process.env.VUE_APP_TITLE = require('./package.json').description
const tenantId = process.env.TENANT_ID

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL || '/',
  outputDir: 'web', 
  assetsDir: 'static',
  lintOnSave: false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false, 
  assetsDir: "./"+tenantId,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: '80',
    // 自动打开浏览器
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      ['/api']: {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          ['^/api']: ''
        }
      }
    },
    disableHostCheck: true,
    // https: true,
  },
  css: {
    loaderOptions: {
      sass: {
        //依次导入的公用的scss变量，公用的scss混入，共用的默认样式
        prependData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins:[
      new MiniCssExtractPlugin({
        // 修改打包后css文件名
      filename: `css/${tenantId}/[name].${Timestamp}.css`,
      chunkFilename: `css/${tenantId}/[name].${Timestamp}.css`, 
      })
      ],
      output: {
        // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
        filename: `js/${tenantId}/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
        chunkFilename: `js/${tenantId}/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
      }
  },
  
  chainWebpack(config) {
    // 修复HMR
    config.resolve.symlinks(true)
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    
    let miniCssExtractPlugin = new MiniCssExtractPlugin({ 
      // 修改打包后css文件名
      filename: `css/${tenantId}/[name].${Timestamp}.css`,
      chunkFilename: `css/${tenantId}/[name].${Timestamp}.css`, 
    })
    config.plugin('extract-css').use(miniCssExtractPlugin)

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()

      config.optimization.minimizer('terser').tap((options) => {
        options[0].terserOptions.compress.drop_console = true
        options[0].terserOptions.compress.drop_debugger = true
        return options
      })

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single'),
        {
          from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
          to: './' //到根目录下
        }
    })
  }
}
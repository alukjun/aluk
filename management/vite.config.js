const path = require('path')

function pathResolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  proxy: {
    '/api': {
      // target: 'http://192.168.31.170:8080/',
      target: 'https://api.1pinliangwei.com/',
      changeOrigin: true,
      secure: false,
      rewrite: path => path.replace(/^\/api/, '')
    }
    // '/api': {
    //   target: 'http://122.51.47.42:8081/',
    //   // target: 'http:192.168.210.119:8080/',
    //   changeOrigin: true,
    //   secure: false,
    //   rewrite: path => path.replace(/^\/api/, '')
    // }
  },
  alias: {
    "/@/": pathResolve("src"),
    '/@components/': pathResolve('./src/components'),
    '/@utils/': pathResolve('./src/utils'),
    '/@pages/': pathResolve('./src/pages'),
  },
  optimizeDeps: {
    include: ["@ant-design/icons-vue"],
  },
  // otherwise, may assets 404 or visit with index.html
  base: "/",
  assetsDir: "assets",
  outputDir: './dist',
  
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/main.ts'),
      name: 'MyLib'
    },
    lintOnSave: false,
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
};
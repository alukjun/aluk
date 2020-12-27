import { resolve } from "path";

function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}

module.exports = {
  proxy: {
    '/api': {
      target: 'http://122.51.47.42:8081/',
      changeOrigin: true,
      secure: false,
      rewrite: path => path.replace(/^\/api/, '')
    }
  },
  alias: {
    "/@/": pathResolve("src"),
    '/@components/': pathResolve(__dirname, './src/components'),
    '/@utils/': pathResolve(__dirname, './src/utils'),
    '/@pages/': pathResolve(__dirname, './src/pages'),
  },
  optimizeDeps: {
    include: ["@ant-design/icons-vue"],
  },
  // otherwise, may assets 404 or visit with index.html
  base: "/start-vue3/",
  assetsDir: "",
};
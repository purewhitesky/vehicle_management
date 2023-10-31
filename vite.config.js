import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "localhost",
    port: 3000, // 端口号
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序 //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      "/mydata": {
        target: "https://mih-fleet.westus2.cloudapp.azure.com/", //代理接口 http://localhost:8888/ https://mih-fleet.westus2.cloudapp.azure.com/
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mydata/, "/"),
      },
      "/BBB": {
        //多代理，首字母不能一樣不然會出錯
        target: "http://192.168.50.15:7000/", //代理2
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/BBB/, "/"),
      },
      "/tomtomapi": {
        //多代理，首字母不能一樣不然會出錯
        target: "https://api.tomtom.com/", //代理2
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tomtomapi/, "/"),
      },
      "/api": {
        target: "https://dev-login.webfleet.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

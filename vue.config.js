/*
 * @Author: Libra
 * @Date: 2021-08-31 10:39:28
 * @LastEditTime: 2021-08-31 11:58:25
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /video-player/vue.config.js
 */
module.exports = {
  pages: {
    index: {
      entry:
        process.env.NODE_ENV === "development" ? "src/main.js" : "src/index.js",
      template: "public/index.html",
      filename: "index.html"
    }
  },
  // 扩展 webpack 配置
  chainWebpack: config => {
    config.module
      .rule("js")
      .include.add("/components")
      .end()
      .use("babel")
      .loader("babel-loader");
  }
};

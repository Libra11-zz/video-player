/*
 * @Author: Libra
 * @Date: 2021-08-30 18:36:40
 * @LastEditTime: 2021-08-31 11:54:28
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /video-player/src/main.js
 */
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

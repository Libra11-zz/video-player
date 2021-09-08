/*
 * @Author: Libra
 * @Date: 2021-08-31 10:33:20
 * @LastEditTime: 2021-08-31 10:41:54
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /video-player/src/index.js
 */
import VideoPlayer from "./components/videoPlayer.vue";

const components = [VideoPlayer];

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

/* 支持使用标签的方式引入 */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default VideoPlayer;

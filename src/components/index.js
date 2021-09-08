/*
 * @Author: Libra
 * @Date: 2021-08-30 18:42:57
 * @LastEditTime: 2021-08-30 18:57:43
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /video-player/src/components/index.js
 */
// 导入组件，组件必须声明 name
import VideoPlayer from "./videoPlayer.vue";
// 为组件提供 install 安装方法，供按需引入
VideoPlayer.install = function(Vue) {
  Vue.component(VideoPlayer.name, VideoPlayer);
};
// 导出组件
export default VideoPlayer;

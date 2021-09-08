<!--
 * @Author: Libra
 * @Date: 2021-08-24 11:16:56
 * @LastEditTime: 2021-09-06 15:51:45
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /video-player/src/App.vue
-->
<template>
  <div id="app">
    <div class="container">
      <div class="video-con">
        <video-player
          :start="start"
          :end="end"
          :play-list="playList"
          :is-complete="true"
          :width="100"
          :height="100"
          @complete="complete"
          :cheatArr="cheatArr"
          :showControlBar="true"
          :id="`my-video`"
        />
      </div>
      <button @click="show">ddd</button>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "./components/videoPlayer.vue";
import data from "./data/index";
import cheatArr from "./data/cheat";
export default {
  name: "App",
  components: {
    VideoPlayer
  },
  data() {
    return {
      start: new Date(data.startAt).getTime(),
      end: new Date(data.endAt).getTime(),
      movies: data.data.reverse(),
      playList: [],
      isShow: true,
      cheatArr: cheatArr
    };
  },
  created() {
    for (const item of this.movies) {
      this.playList.push({
        src: `https://file-test.stac.fun/${item.path}`,
        type: "video/mp4",
        createdAt: item.createdAt
      });
    }
    setTimeout(() => {
      for (const item of this.movies) {
        this.playList.push({
          src: `https://file-test.stac.fun/${item.path}`,
          type: "video/mp4",
          createdAt: item.createdAt
        });
      }
    }, 90000);
  },
  methods: {
    show() {
      this.isShow = !this.isShow;
    },
    complete() {
      this.playList = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.video-con {
  width: 640px;
  height: 480px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>

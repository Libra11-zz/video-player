<!--
 * @Author: Libra
 * @Date: 2021-08-30 10:27:33
 * @LastEditTime: 2021-09-09 16:38:19
 * @LastEditors: Libra
 * @Description: 播放器组件
 * @FilePath: /video-player/src/components/videoPlayer.vue
-->
<template>
  <div class="container" :class="`container${id}`">
    <video
      :id="id"
      class="video-js vjs-default-skin  vjs-big-play-centered"
      controls
      preload="auto"
    />
    <div
      v-if="!isComplete && showControlBar"
      class="control-bar"
      @click.stop="() => {}"
    >
      <div class="volume">
        <span class="iconfont icon-shengyintianchong"></span>
        <vue-slider
          v-model="volume"
          tooltip="none"
          class="volume-slider"
          direction="btt"
          dotSize="8"
          @dragging="setVolume"
        />
      </div>
      <div class="left_time">{{ convertTime(start) }}</div>
      <vue-slider
        v-model="percentage"
        tooltip="none"
        class="progress"
        :disabled="true"
      />
      <div class="right_time">{{ convertTime(moment) }}</div>
    </div>
    <div
      v-if="isComplete && showControlBar"
      class="control-bar2"
      @click.stop="() => {}"
    >
      <span
        v-if="isPlaying"
        @click="playAndPause"
        class="iconfont icon-pause-full"
      ></span>
      <span
        v-else
        @click="playAndPause"
        class="iconfont icon-icon_bofang"
      ></span>
      <div class="volume">
        <span class="iconfont icon-shengyintianchong"></span>
        <vue-slider
          v-model="volume"
          tooltip="none"
          class="volume-slider"
          direction="btt"
          dotSize="8"
          @dragging="setVolume"
        />
      </div>
      <div class="left_time">{{ convertTime(start) }}</div>
      <vue-slider
        v-model="percentage"
        tooltip="none"
        class="slider"
        @dragging="checkRange"
      />
      <div class="right_time">{{ convertTime(moment) }}</div>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import Video from "video.js";
import "video.js/dist/video-js.css";
import "vue-slider-component/theme/default.css";

export default {
  name: "videoPlayer",
  components: {
    VueSlider
  },
  props: {
    id: {
      type: String,
      default: "my-video"
    },
    start: {
      type: Number,
      default: new Date().getTime()
    },
    end: {
      type: Number,
      default: new Date().getTime()
    },
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 480
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    playList: {
      type: Array,
      default: () => []
    },
    showControlBar: {
      type: Boolean,
      default: true
    },
    cheatArr: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    playList: {
      handler(newVal) {
        if (newVal.length === 0) {
          this.preVal = 0;
        }
        if (this.preVal === 0 && newVal.length > 0) {
          this.preVal = 1;
          this.myPlayer.src(this.playList[this.current]);
          clearInterval(this.timer);
          this.timer = null;
          this.progressControl();
        }
      },
      deep: true
    }
  },
  data() {
    return {
      moment: this.start,
      percentage: 0,
      timer: null,
      current: 0,
      timeArr: [],
      myPlayer: null,
      preVal: 0,
      isPlaying: true,
      volume: 0,
      isPlayOrPause: false
    };
  },
  created() {
    this.timeArr = this.handleCreatedAtArr(this.end);
  },
  mounted() {
    this.setContainerSize();
    this.initVideo();
  },
  beforeDestroy() {
    if (this.myPlayer) {
      this.myPlayer.dispose();
    }
  },
  methods: {
    initVideo() {
      this.myPlayer = Video(
        this.id,
        {
          controls: false,
          autoplay: true,
          muted: true,
          preload: "auto",
          sources: [this.playList[this.current]],
          controlBar: {
            volumePanel: {
              inline: false
            },
            liveDisplay: false,
            progressControl: true,
            DurationDisplay: true,
            RemainingTimeDisplay: false
          }
        },
        () => {
          this.progressControl();
          this.defaultVolume();
          if (this.isComplete) {
            this.addBar();
            this.addCheatPoint();
          }
        }
      );
      this.myPlayer.on("error", function() {
        console.log("err", this.myPlayer.error());
        this.current++;
        this.myPlayer.src(this.playList[this.current]);
        this.myPlayer.play();
      });
      this.myPlayer.on("ended", () => {
        this.$emit("complete", this.current);
        this.current++;
        // if (this.current + 1 > this.playList.length) {
        //   clearInterval(this.timer);
        //   this.current = 0;
        //   this.$emit("complete");
        //   return;
        // }
        this.myPlayer.src(this.playList[this.current]);
        this.isPlayOrPause = false;
        this.myPlayer.play();
      });
      this.myPlayer.on("play", () => {
        console.log(this.playList);
        if (!this.isPlayOrPause) {
          this.moment = new Date(
            this.playList[this.current].createdAt
          ).getTime();
        }
      });
    },
    progressControl() {
      this.timer = setInterval(() => {
        this.moment += 1000;
        const percentage =
          ((this.moment - this.start) / (this.end - this.start)) * 100;
        this.percentage = percentage > 100 ? 100 : percentage;
        if (this.percentage === 100) clearInterval(this.timer);
      }, 1000);
    },
    convertTime(time) {
      var date = new Date(time);
      const h = date.getHours();
      const m = date.getMinutes();
      const s = date.getSeconds();
      return (
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
      );
    },
    setContainerSize() {
      const container = document.querySelector(`.container${this.id}`);
      container.style.width = this.width + "%";
      container.style.height = this.height + "%";
    },
    handleCreatedAtArr(end) {
      const arr = this.playList.map(val => new Date(val.createdAt).getTime());
      const fifteenSec = 15000;
      const b = [];
      for (let i = 0; i < arr.length; i++) {
        if (i === arr.length - 1) {
          if (arr[i] + fifteenSec > end) {
            b.push([arr[i], end]);
          } else {
            b.push([arr[i], arr[i] + fifteenSec]);
          }
          return b;
        }
        if (arr[i] + fifteenSec > arr[i + 1]) {
          b.push([arr[i], arr[i + 1]]);
        } else {
          b.push([arr[i], arr[i] + fifteenSec]);
        }
      }
      return b;
    },
    addBar() {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.position = "absolute";
      const slider = document.querySelector(
        `.container${this.id} .slider .vue-slider-rail`
      );
      slider.appendChild(bar);
      const ratio = (this.end - this.start) / slider.offsetWidth;
      for (let i = 0; i < this.timeArr.length; i++) {
        const b = this.createBar(this.timeArr[i][0], this.timeArr[i][1], ratio);
        bar.appendChild(b);
      }
    },
    addCheatPoint() {
      const cp = document.createElement("div");
      cp.className = "cheat-point";
      cp.style.position = "absolute";
      const slider = document.querySelector(
        `.container${this.id} .slider .vue-slider-rail`
      );
      slider.appendChild(cp);
      const ratio = (this.end - this.start) / slider.offsetWidth;
      for (let i = 0; i < this.cheatArr.length; i++) {
        const b = this.createCheatPoint(
          new Date(this.cheatArr[i].time).getTime(),
          ratio,
          this.cheatArr[i].text
        );
        cp.appendChild(b);
      }
    },
    createCheatPoint(time, ratio, text) {
      const cp = document.createElement("div");
      const t = document.createElement("div");
      t.className = "cheat-point-text";
      cp.className = "cheat-point-item";
      t.innerHTML = text;
      t.style.display = "none";
      cp.appendChild(t);
      t.style.padding = "5px 10px";
      t.style.width = "fit-content";
      t.style.width = "fit-content";
      t.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
      t.style.position = "absolute";
      t.style.bottom = "15px";
      t.style.left = "-30px";
      t.style.borderRadius = "2px";
      cp.style.width = "8px";
      cp.style.position = "absolute";
      cp.style.height = "8px";
      cp.style.backgroundColor = "red";
      cp.style.border = "1px solid white";
      cp.style.borderRadius = "50%";
      cp.style.cursor = "pointer";
      const barOffset = (time - this.start) / ratio;
      cp.style.left = barOffset + "px";
      cp.style.top = "-3px";
      cp.style.zIndex = "999";
      cp.onmouseover = () => {
        t.style.display = "block";
      };
      cp.onmouseout = () => {
        t.style.display = "none";
      };
      return cp;
    },
    createBar(start, end, ratio) {
      const Bar = document.createElement("div");
      const barWidth = (end - start) / ratio;
      const barOffset = (start - this.start) / ratio;
      Bar.style.width = barWidth + "px";
      Bar.style.position = "absolute";
      Bar.style.height = "4px";
      Bar.style.backgroundColor = "red";
      Bar.style.left = barOffset + "px";
      Bar.style.top = "0px";
      Bar.style.zIndex = "999";
      return Bar;
    },
    checkRange(val) {
      const time = this.start + ((this.end - this.start) * val) / 100;
      this.timeArr.forEach((item, index) => {
        if (item[0] < time && item[1] > time) {
          this.current = index;
          this.myPlayer.src(this.playList[this.current]);
          this.myPlayer
            .play()
            .then(() => {})
            .catch(() => {});
        }
      });
    },
    // 播放暂停
    playAndPause() {
      this.isPlayOrPause = true;
      if (this.isPlaying) {
        this.myPlayer.pause();
        this.isPlaying = false;
        clearInterval(this.timer);
      } else {
        this.myPlayer.play();
        this.progressControl();
        this.isPlaying = true;
      }
    },
    setVolume(val) {
      this.myPlayer.muted(false);
      this.myPlayer.volume(val / 100);
    },
    defaultVolume() {
      if (this.myPlayer.muted()) {
        this.volume = 0;
      }
      // 默认 50% 音量
      this.myPlayer.volume(0);
      this.volume = this.myPlayer.volume() * 100;
    },
    fullscreen() {
      this.myPlayer.requestFullscreen();
    }
  }
};
</script>
<style scoped lang="scss">
@import url("../assets/iconfont/iconfont.css");
::v-deep .el-progress-bar__inner {
  background-color: red;
  border-radius: 0;
}
::v-deep .el-progress-bar__outer {
  border-radius: 0;
}
::v-deep .video-js {
  width: 100%;
  height: 100%;
}
::v-deep .vue-slider-dot {
  position: absolute;
  z-index: 10000;
}
.container {
  &:hover {
    .control-bar {
      transition: all 0.3s;
      opacity: 1;
    }
    .control-bar2 {
      transition: all 0.3s;
      opacity: 1;
    }
  }
}
.container {
  position: relative;
  font-size: 14px;
}
.control-bar {
  width: 100%;
  display: flex;
  opacity: 0;
  transition: all 0.3s;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 0;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  .progress {
    flex: 1;
  }
  .left_time {
    width: 60px;
    padding: 0 10px;
    text-align: right;
  }
  .right_time {
    padding: 0 10px;
    width: 60px;
  }
  .volume {
    padding-left: 10px;
    position: relative;
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &:hover {
      .volume-slider {
        display: block;
      }
    }
    .volume-slider {
      position: absolute;
      display: none;
      bottom: 60px;
      left: 10px;
      height: 80px !important;
    }
  }
}
.control-bar2 {
  width: 100%;
  display: flex;
  transition: all 0.3s;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  .iconfont {
    cursor: pointer;
  }
  .icon-pause-full {
    padding: 0 10px;
  }
  .icon-icon_bofang {
    padding: 0 10px;
  }
  .volume {
    position: relative;
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &:hover {
      .volume-slider {
        display: block;
      }
    }
    .volume-slider {
      position: absolute;
      display: none;
      bottom: 60px;
      left: 0;
      height: 80px !important;
    }
  }
  .slider {
    flex: 1;
    .bar {
      position: absolute;
      z-index: 10000;
    }
  }
  .left_time {
    width: 60px;
    padding: 0 10px;
    text-align: right;
  }
  .right_time {
    padding: 0 10px;
    width: 60px;
  }
}
</style>

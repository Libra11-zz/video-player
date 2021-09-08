# video-player-libra

## 使用

- `id`: 组件`id`, 每个`video-player`实例都需要有一个唯一的`id`
- `start`:考试开始时间
- `end` :考试结束时间
- `width`: 视频宽度 默认 640`px`
- `height`: 视频高度 默认 480`px`
- `isComplete`:考试是否完成
  - `true`: 完成，切换成可拖动进度条
  - `false`: 未完成，切换成不可拖动进度条
- `playList`: 播放列表，数组
  - 格式：
  ```javascript
  [
    {
      src: `https://file-test.stac.fun/xxx`,
      type: 'video/mp4',
      createdAt: '2021-08-11 11:07:30'
    },
    {
      src: `https://file-test.stac.fun/xxx`,
      type: 'video/mp4',
      createdAt: '2021-08-11 11:07:30'
    },
    ...
  ]
  ```
- `complete`: 每一片视频播放完成的回调
- `showControlBar`: 是否显示下方的工具条，默认为`true`
- `cheatArr`: 作弊点
  - 格式
  ```javascript
  [
    {
      text: "Libra",
      time: "2021-08-11 11:10:48"
    },
    {
      text: "OK",
      time: "2021-08-11 11:11:48"
    }
    ...
  ]
  ```

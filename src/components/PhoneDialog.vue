<script>
export default {
  components: {},
  props: {
    message: {
      type: String,
      default: "",
    },
    material: {
      type: Array,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => [],
    },
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    material: {
      immediate: true,
      handler(val) {
        this.list = val;
      },
    },
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<template>
  <div class="preview ac">
    <div class="top">小微</div>
    <div class="small">微服云-企微</div>
    <div class="time">上午:10:23</div>
    <!-- {{material[0].type}}{{material[0].name}} -->
    <ul class="msg-ul">
      <li class="flex" v-if="message">
        <!-- 写死的消息头像 -->
        <el-avatar :src="require('@/assets/image/profile.jpg')"></el-avatar>
        <div class="msg">{{ message }}</div>
      </li>

      <li class="flex msg-li" v-for="(item, index) in material" :key="index">
        <el-avatar :src="require('@/assets/image/profile.jpg')"></el-avatar>
        <!-- 群发消息本地上传单独的照片和视频 -->
        <div v-if="item.fileType == 0">
          <el-image fit="scale-down" style="width: 130px; height: 100px" :src="item.fileUrl"></el-image>
        </div>
        <div v-if="item.fileType == 2">
          <video style="width: 100px; height: 100px" controls preload="auto">
            <source :src="item.fileUrl" type="video/mp4" />
          </video>
        </div>
        <!-- 图片 -->
        <div v-if="item.type == 0">
          <el-image fit="scale-down" style="width: 130px; height: 100px" :src="item.url"></el-image>
        </div>
        <!-- 群活码 -->
        <div v-if="item.codeType || item.codeType == 0">
          <el-image fit="scale-down" style="width: 130px" :src="item.codeUrl"></el-image>
        </div>

        <!-- 视频 -->
        <div v-if="item.type == 2" class="video">
          <video
            id="video"
            class="video-js vjs-default-skin vjs-big-play-centered"
            controls
            webkit-playsinline="true"
            playsinline="true"
            :autoplay="false"
            preload="none"
          >
            <source :src="item.url" type="video/mp4" />
          </video>
          <!-- <el-image fit="scale-down" style="width: 100px; height: 75px" :src="item.coverUrl"></el-image> -->
        </div>

        <!-- 文件 -->
        <div class="link fxbw" v-if="item.type == 3">
          <span>{{ item.name }}</span>
          <!-- <div class="flex"> -->
          <!-- <div class="time">{{ item.size || "1MB" }}</div> -->
          <div class="elimage">
            <el-image
              fit="scale-down"
              style="width: 20px; height: 20px"
              :src="require('/src/assets/footageCenter/file.png')"
            ></el-image>
          </div>

          <!-- filesTag..svg :src="require('/src/assets/image/filesTag..svg')"-->
          <!-- </div> -->
        </div>
        <!-- 文章链接 -->
        <div class="linkAndAudio fxbw" v-if="item.type == 7 || item.type == 8">
          <span> {{ item.name }}</span>
          <div class="elimage">
            <!-- <div class="time">{{ item.content }}</div> -->
            <el-image
              fit="scale-down"
              style="width: 20px; height: 20px"
              :src="require('/src/assets/footageCenter/article.png')"
            ></el-image>
          </div>
        </div>
      </li>
      <!-- <li class="flex msg-li" v-for="message in messageList" :key="message">
        <el-avatar
          shape="square"
          :src="require('@/assets/image/profile.jpg')"
        ></el-avatar>
        <div class="msg">
          <slot name="text" v-bind:text="message"></slot>
        </div>
      </li>
      <li class="flex msg-li" v-for="image in imageList" :key="image">
        <el-avatar
          shape="square"
          :src="require('@/assets/image/profile.jpg')"
        ></el-avatar>
        <div class="msg" style="line-height: 0; padding: 5px">
          <slot name="image" v-bind:image="image"></slot>
        </div>
      </li> -->
    </ul>
  </div>
</template>

<style lang="scss" scoped>
// 视频
.video {
  width: 170px;
  height: 130px;
}
//文件,文章链接
.link,
.linkAndAudio {
  width: 180px;
  height: 50px;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  color: #222222;
  font-size: 14px;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .elimage {
    padding: 5px;
    background-color: #f5f5f5;
  }
}
.msg-li {
  margin-top: 10px;
}
.preview {
  width: 300px;
  height: 461px;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 15px 10px;
  line-height: 1.5;
  // zoom:.9;
  .top {
    font-weight: 600;
  }
  .small {
    font-size: 12px;
  }
  .time {
    font-size: 12px;
    color: #aaa;
    // transform: scale(0.8);
    padding: 10px 0 5px;
  }
  .msg-ul {
    // margin: 0;
    // padding: 10px 10px 0 0;
    max-height: 80%;
    overflow: auto;
  }

  .msg {
    min-height: 28px;
    background-color: #fff;
    border: 1px solid #e4e6e9;
    display: inline-block;
    position: relative;
    text-align: left;
    font-size: 14px;
    line-height: 22px;
    padding: 3px 6px;
    border-radius: 4px;
    max-width: 90%;
    min-width: 24px;
    box-sizing: border-box;
    word-break: break-all;
    white-space: pre-line;
    // margin-left: 10px;
    &:before {
      content: " ";
      display: block;
      position: absolute;
      left: -6px;
      border-width: 4px 6px;
      border-left: 0;
      width: 0;
      border-style: solid;
      border-color: transparent;
      border-right-color: #fff;
      top: 10px;
      z-index: 888;
    }
  }
}
.el-avatar {
  flex: none;
}
.flex {
  gap: 10px;
}
</style>

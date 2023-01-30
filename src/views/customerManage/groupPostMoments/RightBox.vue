<template>
  <div style="width: 100%">
    <div class="right_box_top">
      <img src="@/assets/image/20220517102756.png" style="width: 100%" />
      <img class="right_box_top_user" src="@/assets/image/20220517102835.png" />
    </div>
    <ul class="msg_ul">
      <li>
        <!-- 写死的消息头像 -->
        <div class="msg_ul_countent">
          <div class="msg_ul_countent_avatar">
            <img class="msg_ul_countent_avatar_user" :src="require('@/assets/image/20220517102827.png')"></img>
          </div>
          <div class="msg_ul_countent_material">
            <span class="msg_ul_countent_material_userName">
              <ww-open-data
                type="userName"
                :openid="userInfo.userId"
              ></ww-open-data>
            </span>  
            <div v-if="this.pageObj.contentText" class="msg_ul_countent_material_contentText">{{ this.pageObj.contentText }}</div>
            <div :class="material.length > 2? 'msg_ul_countent_material_imgBox':''">
              <div v-for="(item, index) in material" :key="index" :class="item.fileType == 0 || item.type == 0 ? `msg_ul_countent_material_img msg_ul_countent_material_img${index+1}` : ''">
              <!-- 图片 -->
              <template v-if="item.type == 0">
                <img v-if="material.filter(v => v.type ==0).length == 1 " :src="item.url" class="oneImg"/>
                <img v-else :src="item.url" class="moreImg"/>
              </template>
              <!-- 视频 -->
              <div v-if="item.type==2">
                <video style="width: 100px; height: 100px" controls preload="auto">
                  <source :src="item.url" type="video/mp4" />
                </video>
              </div>
              <!-- 群活码 -->
              <div v-if="item.codeType || item.codeType == 0">
                <el-image fit="scale-down" style="width: 130px" :src="item.codeUrl"></el-image>
              </div>
              <!-- 文件 -->
              <div class="link fxbw" v-if="item.type == 3">
                <span>{{ item.name }}</span>
                <div class="elimage">
                  <el-image fit="scale-down" style="width: 20px; height: 20px"
                    :src="require('/src/assets/footageCenter/file.png')"></el-image>
                </div>
              </div>
              <!-- 文章链接 -->
              <div class="linkAndAudio fxbw" v-if="item.type == 7 || item.type == 8">
                <span> {{ item.name }}</span>
                <div class="elimage">
                  <el-image fit="scale-down" style="width: 20px; height: 20px"
                    :src="require('/src/assets/footageCenter/article.png')"></el-image>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    pageObj: {
      type: Object,
      default: () => {},
    },
    material: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    this.userInfo = this.$store.state.user;
  },
};
</script>
<style lang="scss" scoped>
.right_box_top {
  position: relative;
  &_user {
    width: 64px;
    position: absolute;
    right: 20px;
    bottom: 0;
    transform: translate(0, 50%);
  }
}

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

.small {
  font-size: 12px;
}

.time {
  font-size: 12px;
  color: #aaa;
  // transform: scale(0.8);
  padding: 10px 0 5px;
}

.msg_ul {
  margin: 60px 0 20px 10px;
  max-height: 70%;
  overflow: auto;
  &_countent {
    display: flex;
    justify-content: space-between;
    &_avatar {
      width: 40px;
      border-radius: 3px;
      img {
        width: 100%;
      }
    }
    &_material {
      width: calc(100% - 50px);
      &_userName {
        font-size: 16px;
        font-weight: bold;
        color: #5b6a91;
        line-height: 16px;
      }
      &_contentText {
        margin: 10px 0;
      }
      &_imgBox {
        width: 230px;
      }
      &_img {
        float: left;
        .oneImg {
          width: 30%;
          height: 100%;
          object-fit: scale-down;
        }
        .moreImg {
          width: 70px;
          height: 70px;
          object-fit: cover;
        }
      }
      &_img2,
      &_img8 {
        margin: 0 5px;
      }
      &_img5 {
        margin: 5px;
      }
      &_img6,
      &_img4 {
        margin: 5px 0;
      }
    }
  }
}
</style>
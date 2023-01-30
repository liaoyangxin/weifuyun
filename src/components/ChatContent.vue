<script>
import Voice from "@/components/Voice.vue";
import { js } from "js-beautify/js/src";
import { getPersonalInfo, getMemberInfo } from "@/api/conversation/content.js";
import ItemVue from "@/layout/components/Sidebar/Item.vue";

export default {
  name: "ChatContent",
  components: { Voice },
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  components: {},
  data() {
    return {
      dialogVisible: false,
      audioSrc: [],
      list: [],
      cardList: [],
      listArr: null,
      data: [],
      dataArr: null,
      ary: [],
      externalUserid: "",
      userId: "",
      cardInfo: {
        avatar: "",
        name: "",
        corpname: "",
      },
      nothingCardIngo: "",
      abc: "",
      nameShow: false,
    };
  },
  computed: {
    content() {
      switch (this.message.msgType) {
        case "text": // 文本
          return this.message.content;
        case "image": // 图片
        case "emotion":
        case "file": // 文件
        case "link": // 链接
        case "video": // 视频
        case "voice":
        case "redpacket":
        case "location":
        case "external_redpacket":
        case "card":
          return JSON.parse(this.message.content);
        case "mixed":
          return JSON.parse(this.message.content);
        case "meeting_voice_call":
          // play_length
          let obj = JSON.parse(this.message.content);
          let mss =
            parseInt(obj.endtime) * 1000 - parseInt(this.message.msgTime);
          let hours = parseInt(
            (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
          let secods = Math.ceil((mss % (1000 * 60)) / 1000);
          obj.mss = mss;
          obj.play_length = `${hours > 9 ? hours : "0" + hours}:${
            minutes > 9 ? minutes : "0" + minutes
          }:${secods > 9 ? secods : "0" + secods}`;
          return obj;
        default:
          return;
        case "calendar": // 日程字段
          let item = JSON.parse(this.message.content);
          let YYYY = new Date(item.starttime * 1000).getFullYear();
          let MM = (new Date(item.starttime * 1000).getMonth() + 1 + "").padStart(
            2,
            "0"
          );
          let DD = (new Date(item.starttime * 1000).getDate() + "").padStart(2, "0");
          item.date = MM + "月" + DD + "日";
          let week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
          let day = new Date(item.starttime * 1000).getDay();
          item.day = week[day - 1];
          let sh = new Date(item.starttime * 1000)
            .getHours()
            .toString()
            .padStart(2, "0");
          let sm = new Date(item.starttime * 1000)
            .getMinutes()
            .toString()
            .padStart(2, "0");
          item.startTime = sh + ":" + sm;
          let eh = new Date(item.endtime * 1000)
            .getHours()
            .toString()
            .padStart(2, "0");
          let em = new Date(item.endtime * 1000)
            .getMinutes()
            .toString()
            .padStart(2, "0");
          item.endTime = eh + ":" + em;
          return item;
      }
    },
  },
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
    // 红包对象
    if (this.message.msgType == "external_redpacket") {
      this.list = this.message.content;
      this.strToStr(this.list);
    }
    if (this.message.msgType == "card") {
      this.abc = JSON.parse(this.message.content);
      var externalUserid = this.abc.userid;
      var userId = this.abc.userid;
      getPersonalInfo(externalUserid).then((res) => {
        if (res.data != null) {
          this.cardInfo.avatar = res.data.avatar;
          this.cardInfo.name = res.data.name;
          this.cardInfo.corpname = res.data.corpname;
          this.cardInfo.type = res.data.type;
        } else {
          getMemberInfo(userId).then((res) => {
            this.nothingCardIngo = res.data;
          });
        }
      });
    }
  },
  methods: {
    strToStr(str) {
      let newStr = str.replace("{", "");
      newStr = newStr.replace("}", "");
      this.listArr = newStr.split(",");
      for (let i = 0; i < this.listArr.length; i++) {
        this.data = this.listArr.map((res) => {
          return res.split("=")[1];
        });
      }
    },
    close() {
      this.dialogVisible = false;
      const mp3 = this.$refs.AudioPlayer;
      mp3.pause();
    },
    // playAudio(type) {
    //   this.audioSrc = [JSON.parse(this.message.contact)[type]];
    //   this.dialogVisible = true;
    // },
    onBeforePlay(next) {
      next(); // 开始播放
    },
  },
};
</script>

<template>
  <div class="content">
    <!-- 如果是撤回消息 -->
    <div>
      <div v-if="message.recall == 1">
        <span
          v-if="message.fromId != message.currentUserId"
          class="flex"
          style="float: left; position: relative"
        >
          <div v-if="message.msgType === 'text'">
            <span v-html="message.content" class="text"></span>
          </div>
        </span>

        <span v-else style="float: right; position: relative">
          <div class="flex" v-if="message.msgType === 'text'">
            <span v-html="message.content" class="text"></span>
          </div>
        </span>
      </div>
    </div>

    <!-- 如果是文字 -->
    <div v-if="message.msgType === 'text'">
      <span v-if="message.recall == 0">
        <span
          v-if="message.fromId != message.currentUserId"
          style="float: left"
          class="text"
          v-html="message.content"
        ></span>
        <span
          v-else
          style="float: right"
          class="text"
          v-html="message.content"
        ></span>
      </span>
    </div>
    <!-- 如果是名片 -->
    <div
      v-else-if="message.msgType === 'card'"
      class="card"
      v-show="message.msgType == 'card'"
    >
      <!-- 如果第一个接口不为空，默认展示 -->
      <div class="flex" style="flex-direction: column" v-if="cardInfo != ''">
        <div class="cardTop">
          <img :src="cardInfo.avatar" alt="" />
          <div
            class="flex"
            style="flex-direction: column; color: black; margin-left: 4px"
          >
            <ww-open-data type="userName" :openid="cardInfo.name" />
            <ww-open-data
              type="corpName"
              style="color: #ccc; font-size: 8px"
              :openid="cardInfo.corpName"
            />
          </div>
        </div>
        <div class="footer">
          <span style="font-size: 8px">{{
            cardInfo.type == 1 ? "个人名片" : "企业微信名片"
          }}</span>
        </div>
      </div>

      <!-- 如果第一个接口为空 ，调第二个接口-->
      <div v-else class="felx" style="flex-direction: column">
        <!-- <div v-if="nothingCardIngo!=''" calss="flex" style="flex-direction:column;">
          <div class="cardTop">
           <img :src="nothingCardIngo.avatar" alt="">
           <div class="flex" style="flex-direction:column;color:black;margin-left:4px;">
           <ww-open-data type="userName" :openid="nothingCardIngo.name" />
           <ww-open-data type="corpName" style="color:#ccc;font-size:8px;" :openid="nothingCardIngo.corpName" />
          </div>
        </div>
        <div class="footer">
          <span style="font-size:8px;">{{nothingCardIngo.type==1?'个人名片':'企业微信名片'}}</span>
        </div>
      </div> -->

        <!-- 如果都查不到就默认的头像 -->
        <div style="border-bottom: 1px solid #ccc; width: 100%; float: left">
          <img :src="require('@/assets/conversation/personal2.png')" alt="" />
        </div>
        <span v-show="!nameShow">{{ content.corpname }}</span>
      </div>

      <!-- <span>{{content.corpname}}</span> -->
      <ww-open-data
        type="corpName"
        style="color: #ccc; font-size: 8px"
        :openid="cardInfo.corpName"
      />
    </div>
    <!-- 如果是地址 -->
    <div v-else-if="message.msgType === 'location'">
      <div class="location">
        <div class="locationTop" style="text-align: start">
          <p class="addresstitle">{{ content.title }}</p>
          <p class="address">{{ content.address }}</p>
        </div>
        <el-image :src="require('@/assets/conversation/map.png')"> </el-image>
      </div>
    </div>
    <!-- 如果是图片， -->
    <div v-else-if="'image,emotion'.includes(message.msgType)">
      <template>
        <el-image
          class="images"
          v-if="message.fromId != message.currentUserId"
          style="height: 100px; float: left"
          :src="content.attachment"
          fit="contain"
          :preview-src-list="[content.attachment]"
        >
        </el-image>
        <el-image
          class="images"
          v-else
          style="height: 100px; float: right"
          :src="content.attachment"
          fit="contain"
          :preview-src-list="[content.attachment]"
        >
        </el-image>
      </template>
    </div>

    <!-- 如果是文件 -->
    <div v-else-if="message.msgType === 'file'">
      <a
        style="float: right"
        class="box"
        target="balnk"
        :href="content.attachment"
      >
        <el-row :gutter="5">
          <el-col :span="16" style="text-align: start">
            <p class="title" style="font-size: 12px">{{ content.filename }}</p>
            <p class="descriptionn">{{ content.filesize | convertSize }}</p>
          </el-col>
          <el-col :span="8">
            <el-image
              style="width: 50px; height: 50px"
              :src="require('/src/assets/image/icon_file.svg')"
              fit="contain"
            >
            </el-image>
          </el-col>
        </el-row>
      </a>
    </div>

    <!-- 如果是链接 -->
    <div
      style="background-color: #f5f5f5; border-radius: 5px; float: right"
      v-else-if="message.msgType === 'link'"
      class="link"
    >
      <a :href="content.link_url" target="balnk">
        <div class="flex share">
          <span class="toptitle">
            <span class="title" style="font-size: 6px; color: black">{{
              content.title
            }}</span>
            <div
              class="contentHidden"
              v-if="content.description != null"
              style="font-size: 6px"
            >
              {{ content.description }}
            </div>
            <div class="contentHidden" v-else style="font-size: 6px"></div>
          </span>
          <div>
            <img
              style="
                width: 40px;
                height: 40px;
                margin-left: 10px;
                margin-top: 46%;
                margin-right: 3px;
              "
              :src="content.image_url"
              alt=""
            />
          </div>
        </div>
      </a>
    </div>

    <!-- 如果是语音 -->
    <div v-else-if="message.msgType === 'voice'">
      <span
        v-if="message.fromId != message.currentUserId"
        class="flex voice"
        style="float: left"
      >
        <voice :amrUrl="content.attachment"></voice>
        <span>{{ content.play_length }}"</span>
      </span>
      <span v-else style="float: right" class="flex voice">
        <span>{{ content.play_length }}"</span>
        <voice :amrUrl="content.attachment"></voice>
      </span>
    </div>
    <!-- 如果是红包 -->
    <div v-else-if="'redpacket,external_redpacket'.includes(message.msgType)">
      <div class="hongPack">
        <div class="top">
          <el-image
            style="width: 23px; height: 27px"
            :src="require('@/assets/conversation/hongPack.png')"
            fit="contain"
          >
          </el-image>
          <span>{{ data[0] }}</span>
        </div>
        <div class="bottom">
          <span>{{
            data[3] == 1
              ? "普通红包"
              : data[3] == 2
              ? "拼手气红包"
              : "激励群红包"
          }}</span>
          <span>{{ data[2] / 100 }}元</span>
        </div>
      </div>
    </div>
    <!-- 如果是视频 -->
    <template v-else-if="message.msgType === 'video'">
      <div v-if="message.fromId != message.currentUserId" style="float: left">
        <video
          id="video"
          class="video-js vjs-default-skin vjs-big-play-centered"
          controls
          webkit-playsinline="true"
          playsinline="true"
          :autoplay="false"
          preload="none"
        >
          <source :src="content.attachment" type="video/mp4" />
        </video>
      </div>
      <div v-else style="float: right">
        <video
          id="video"
          class="video-js vjs-default-skin vjs-big-play-centered"
          controls
          webkit-playsinline="true"
          playsinline="true"
          :autoplay="false"
          preload="none"
        >
          <source :src="content.attachment" type="video/mp4" />
        </video>
      </div>
    </template>
    <!-- 如果是语音通话 -->
    <template v-else-if="message.msgType === 'meeting_voice_call'">
      <span v-if="message.fromId != message.currentUserId" style="float: left">
        <!-- <voice :amrUrl="content.attachment" ></voice> -->
        <!-- <span>{{content.play_length}}"</span> -->
        <div class="voice2" style="text-align: left">
          <span class="icon iconfont">&#xe6b0;</span> 通话时长
          {{ content.play_length }}
        </div>
        <voice
          :amrUrl="content.attachment"
          voiceType="meeting_voice_call"
          :playLength="content.play_length"
          :mss="content.mss"
        ></voice>

        <!-- <voice :amrUrl="content.attachment" ></voice> -->
      </span>
      <span v-else style="float: right">
        <!-- <span>{{content.play_length}}"</span> -->
        <!-- <voice :amrUrl="content.attachment" ></voice> -->
        <div class="voice2" style="text-align: right">
          通话时长 {{ content.play_length }}
          <span class="icon iconfont">&#xe6b0;</span>
        </div>
        <voice
          :amrUrl="content.attachment"
          voiceType="meeting_voice_call"
          :playLength="content.play_length"
          :mss="content.mss"
        ></voice>
      </span>
    </template>
    <!-- 会议 -->
    <template v-else-if="message.msgType === 'calendar'">
      <div class="calendarBox" :style="`float:${message.fromId != message.currentUserId ? 'left': 'right'}`">
        <div class="head">
          <div style="font-size: 14px; line-height: 22px">
            {{ content.title }}
          </div>
          <div style="font-size: 12px">{{ content.date }} {{content.day}}  {{content.startTime}} - {{content.endTime}}</div>
        </div>
        <div class="acount">
          <div>
            组织人 <span class="val">{{ content.creatorname }}</span>
          </div>
          <div>
            参与人
            <span
              class="val"
              v-if="
                content &&
                content.attendeename &&
                content.attendeename.length > 0
              "
            >
              <span v-for="(item, index) of content.attendeename" :key="index"
                >{{ item }}
                {{ content.attendeename.length - 1 > index ? "," : "" }}</span
              >
            </span>
          </div>
          <div>
            地点 <span class="val">{{ content.place }}</span>
          </div>
          <div class="icon">
            <img src="@/assets/fontImg/date.png" />
            日程
          </div>
        </div>
      </div>
    </template>

    <!-- mixed -->
    <!-- <div v-else-if="message.msgType === 'mixed'" class="box">
      <div v-for="(item, index) in content.item" :key="index">
        <div v-if="item.type === 'text'" class="text" v-html="item.content"></div>
        <template v-else-if="'image,emotion'.includes(item.type)">
          <el-image
            style="height: 100px"
            :src="item.content.attachment"
            fit="contain"
            :preview-src-list="[item.content.attachment]"
          >
          </el-image>
        </template>
      </div>
    </div> -->

    <!-- <div v-else-if="message.msgType === 'weapp'" class="box">
      <div class="title">{{ content }}</div>
      <div class=" descriptionn">小程序</div>
    </div>
    <div v-else-if="message.msgType === 'card'" class="box">
      <el-row :gutter="5">
        <el-col :span="16">
          <p class="title">{{ content.userid }}</p>
          <p class=" descriptionn">{{ content.corpname }}</p>
        </el-col>
        <el-col :span="8">
          <el-image
            style="width: 80px; height:80px"
            :src="content.image_url"
            fit="contain"
          >
          </el-image>
        </el-col>
      </el-row>
    </div> -->
    <div v-else>不支持的消息类型：{{ message.msgType }}</div>
  </div>
</template>

<style lang="scss" scoped>
.share {
  width: 220px;
  height: 80px;
}
.bigbox {
  flex-direction: column;
}
.toptitle {
  display: flex;
  flex-direction: column;
  padding: 3px;
  // margin-left: 10px;
  width: 80%;
  text-align: start;
}
.contentHidden {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin-bottom: 6px;
  margin-top: 20px;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  // border-bottom: 1px solid #ccc;
}
.voice {
  background-color: #f5f5f5;
  border-radius: 5px;
  align-items: center;
  padding: 3px;
}
.voice2 {
  background-color: #eea151;
  // border-radius: 5px;
  color: #fff;
  align-items: center;
  padding: 3px;
  width: 200px;
}
/deep/.el-icon-microphone {
  font-size: 25px !important;
}
// 文本
.text {
  color: #000;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  text-align: start;
}
#id {
  width: 30px;
  height: 30px;
}
.message {
  // position: relative;
  padding: 10px;
  width: 200px;
  border-radius: 5px;
  // background: $blue;
  background: #f3f5f9;
  color: #999;
  display: inline-block;
  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: -13px;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-right-color: #f3f5f9;
  }
}

.box {
  width: 150px;
  line-height: 25px;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 8px 0 rgba(0, 0, 0, 0.01);
  position: relative;
  background: #f8f8f8;
  color: #000;
  overflow: hidden;
  display: block;

  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical; /* max number of lines to show */
    -webkit-line-clamp: 2; /* needed for it to work */
    overflow: hidden;
    // font-size: 12px;
  }
  .descriptionn {
    color: #999;
    display: -webkit-box;
    -webkit-box-orient: vertical; /* max number of lines to show */
    -webkit-line-clamp: 2; /* needed for it to work */
    overflow: hidden;
  }
}
.text {
  white-space: pre-wrap;
  word-break: break-word;
  // line-height: 1.5;
}
#video {
  width: 100%;
  height: 80%;
}
// 地址
.location {
  width: 200px;
  height: 160px;
  float: right;
  // border: 1px solid red;
  .locationTop {
    height: 50px;
    background-color: #f5f5f5;
    padding: 2px;
    .addresstitle {
      color: #222222;
      font-size: 8px;
    }
    .address {
      font-size: 4px;
    }
  }
}
// 红包
.hongPack {
  width: 150px;
  height: 60px;
  background-color: #eea151;
  float: right;
  .top {
    width: 100%;
    border-bottom: 1px solid #f5bd82;
    display: flex;
    align-items: center;
    padding: 5px;
    span {
      font-size: 6px;
      color: #fff;
      margin-left: 5px;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: #ffffff;
    padding: 3px;
  }
}
// 链接
// 名片
.card {
  width: 150px;
  height: 70px;
  background-color: #f5f5f5;
  float: right;
  .cardTop {
    display: flex;
    align-items: center;
    padding: 5px;
    img {
      width: 40px;
      height: 40px;
    }
    span {
      font-size: 12px;
      margin-left: 5px;
      color: black;
    }
    border-bottom: 1px solid #e6e6e6;
  }
  .footer {
    span {
      font-size: 12px;
      float: left;
    }
  }
}

.el-image__inner {
  width: 100%;
}
.calendarBox {
  display: inline-block;
  width: 240px;
  text-align: left;
  .head {
    height: 64px;
    background-color: #06a17e;
    color: #fff;
    padding-left: 12px;
    padding-top: 8px;
  }
  .acount {
    padding-left: 12px;
    padding-top: 8px;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    font-size: 12px;
    line-height: 16px;
    color: #666;
    .val {
      color: #222;
    }
    .icon {
      color: #06a17e;
      font-size: 12px;
      line-height: 16px;
      margin-bottom: 12px;
      img {
        width: 12px;
      }
    }
  }
}
</style>

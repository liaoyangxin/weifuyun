<script>
import BenzAMRRecorder from "benz-amr-recorder";
export default {
  name: "Voice",
  props: {
    amrUrl: {
      type: String,
      default: "",
    },
    voiceType: {
      type: String,
      default: "voice",
    },
    playLength: {
      type: String,
      default: "00:00:00",
    },
    mss: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      actived: false,
      interVal: null,
      pressVal: 0,
      maxPress: 0
    };
  },
  computed: {},
  watch: {},
  created() {
    this.maxPress = Math.ceil(this.mss / 1000) * 1000
    this.__proto__.$isVoice || document.addEventListener("click", this.stop);
    this.__proto__.$isVoice = true;
  },
  mounted() {},
  methods: {
    play() {
      console.log('this.$playRec', this.$playRec)
      if (this.amrUrl) {
        if (this.$playRec) {
          if (this.stop(true)) {
            return;
          }
        }
        this.__proto__.$playRec = new BenzAMRRecorder();
        this.__proto__.$playRecSymbole = this.amrUrl;
        this.$playRec
          .initWithUrl(this.amrUrl)
          .then(() => {
            this.actived = true;
            this.$playRec.play();
            if (this.voiceType === 'meeting_voice_call') {
              this.interVal = setInterval(() => {
                this.pressVal += 1000
              }, 1000)
            }
            this.$playRec.onEnded(() => {
              this.actived = false;
              this.pressVal = 0
              clearInterval(this.interVal)
            });
          })
          .catch((e) => {
            this.$message.error("播放录音失败");
          });
      }
      // this.audioSrc = [JSON.parse(this.message.contact)[type]]
    },
    //停止播放
    stop(noset) {
      if (this.$playRec && this.$playRec.isPlaying()) {
        this.$playRec.stop();
        if (!noset || this.__proto__.$playRecSymbole === this.amrUrl) {
          this.__proto__.$playRecSymbole = "";
          return true;
        }
      }
    },
    toTime(mss) {
      let str = "";
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let secods = parseInt((mss % (1000 * 60)) / 1000);
      str = `${hours > 9 ? hours : "0" + hours}:${
        minutes > 9 ? minutes : "0" + minutes
      }:${secods > 9 ? secods : "0" + secods}`;
      return str;
    },
    changePressVal(val) {
      const scend = Math.ceil(val/1000)
      this.pressVal = scend * 1000
      if (this.amrUrl) {
        if (this.$playRec) {
          if (this.stop(true)) {
            return;
          }
        }
        this.__proto__.$playRec = new BenzAMRRecorder();
        this.__proto__.$playRecSymbole = this.amrUrl;
        this.$playRec
          .initWithUrl(this.amrUrl)
          .then(() => {
            this.actived = true;
            this.$playRec.play(scend);
            if (this.voiceType === 'meeting_voice_call') {
              this.interVal = setInterval(() => {
                this.pressVal += 1000
              }, 1000)
            }
            this.$playRec.onEnded(() => {
              this.actived = false;
              this.pressVal = 0
              clearInterval(this.interVal)
            });
          })
          .catch((e) => {
            this.$message.error("播放录音失败");
          });
      }
    },
    aa(e){
      
    }
  },
};
</script>

<template>
  <div>
    <i
      v-if="voiceType === 'voice'"
      :class="['el-icon-microphone', actived && 'actived']"
      style="font-size: 40px; color: #199ed8"
      @click.stop="play('attachment')"
    ></i>
    <div v-else-if="voiceType === 'meeting_voice_call'" class="voiceCallBox" @click.stop="aa">
      <i
        :class="['iconfont cp', actived ? 'icon_zanting' : 'icon_bofang']"
        style="font-size: 22px; color: #eea151"
        @click.stop="play('attachment')"
      ></i>
      <span style="font-size: 12px; margin-top: 6px"
        >{{ toTime(pressVal) }} / {{ toTime(maxPress) }}</span
      >
      <i
        :class="['iconfont icon_laba', actived && 'actived']"
        style="font-size: 22px; color: #cccccc"
      ></i>
      <el-slider
        class="voiceCallBox_progress"
        v-model="pressVal"
        :min="0"
        :max="maxPress"
        :show-tooltip="false"
        @change="changePressVal"
      ></el-slider>
    </div>

    <!-- <AudioPlayer
          :audio-list="audioSrc"
          ref="AudioPlayer"
          :before-play="onBeforePlay"
        /> -->
    <!-- <el-dialog v-if="audioSrc[0]" :visible.sync="dialogVisible" width="30%" @close="close">
      <div class="shabowboxvidoe shabowboxaudio">
        <audio controls>
          <source :src="audioSrc[0]" type="audio/mpeg" />
        </audio>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog> -->
  </div>
</template>

<style lang="scss" scoped>
@keyframes play {
  from {
    // color: red;
  }
  to {
    color: #eea151;
  }
}
.actived {
  animation: play 1s infinite alternate;
}
.voiceCallBox {
  padding: 10px 5px 20px 5px;
  background-color: #f5f5f5;
  width: 200px;
  display: flex;
  justify-content: space-between;
  position: relative;
  &_progress {
    position: absolute;
    bottom: -8px;
    width: calc(100% - 10px);
  }
}
/deep/.el-slider__bar {
  background-color: #eea151;
  height: 3px;
}
/deep/.el-slider__runway {
  height: 3px;
}
/deep/.el-slider__button {
  width: 6px;
  height: 6px;
}
/deep/.el-slider__button {
  border: 1px solid #eea151;
  background-color: #eea151;
}
/deep/.el-slider__button-wrapper {
  position: absolute;
  z-index: 1001;
  top: -8px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
}
</style>

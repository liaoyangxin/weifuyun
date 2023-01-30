<template>
  <div>
    <ul class="takecontent">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="mt10"
        :id="`id${item.msgId}`"
      >
        <!-- :class="{ fr: item.fromId === item.fromId }" -->
        <!-- <span v-if="item.fromInfo.name">{{item.fromInfo.name}}</span> -->
        <!-- 别人的消息 -->
        <div v-if="item.fromId != item.currentUserId">
          <div class="flex" style="position: relative">
            <!-- 头像 -->
            <img
              style="position: absolute; left: 8px; marigin-right: 8px"
              class="imgSize"
              v-if="item.fromAvatar != null"
              :src="item.fromAvatar"
              alt=""
            />
            <img
              v-else
              style="
                position: absolute;
                left: 8px;
                border-radius: 3px;
                marigin-right: 8px;
              "
              class="imgSize"
              :src="require('@/assets/image/icon-kehu.png')"
              alt=""
            />

            <div class="ml50">
              <div class="leftTime">
                <!-- 名称时间 -->
                <div style="text-align: start">
                  <span
                    style="font-size: 14px; font-weight: 400; color: #222222"
                  >
                    <ww-open-data
                      v-if="item.fromId"
                      type="userName"
                      :openid="item.fromName"
                    />
                    <span v-else style="color: #222222">{{ item.remark }}</span>
                  </span>
                  <span class="" style="font-size: 12px">{{
                    item.msgTime | formatDateTime
                  }}</span>
                  <span
                    v-show="item.recall == '1'"
                    class="revoke"
                    style="margin-left: 4px"
                    >已撤回</span
                  >
                </div>

                <!-- 内容 -->
                <div class="mt10" style="width: 100%">
                  <ChatContent :message="item"></ChatContent>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 自己的消息 -->
        <div class="mb15 bigbox" v-else>
          <!-- 时间，消息内容，姓名 -->
          <div class="flex" style="position: relative">
            <!-- 时间 -->
            <div style="position: absolute; right: 56px">
              <!-- 是否撤回 -->
              <span
                v-show="item.recall == '1'"
                class="revoke"
                style="margin-right: 4px"
                >已撤回</span
              >
              <span class="time" style="font-size: 12px">{{
                item.msgTime | formatDateTime
              }}</span>
              <!-- 名称 -->
              <span
                style="
                  font-size: 14px;
                  font-weight: 400;
                  color: #222222;
                  margin-left: 4px;
                "
              >
                <span>{{ item.fromName || item.remark }}</span>
              </span>
            </div>

            <div class="mt20" style="width: 100%; padding-right: 56px">
              <ChatContent :message="item"></ChatContent>
            </div>
            <img
              class="imgSize"
              v-if="item.fromAvatar != null"
              :src="item.fromAvatar"
              alt=""
            />
            <img
              class="imgSize"
              v-else
              style="border-radius: 3px"
              :src="require('@/assets/image/icon-kehu.png')"
              alt=""
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ChatContent from "@/components/ChatContent.vue";
export default {
  components: {
    ChatContent,
  },
  props: {
    data: {
      // 从 chatListClass 传来
      type: Array,
      defluat: () => [],
    },
    chatName: {
      type: String,
      default: () => "",
    },
    msgId: {
      type: String,
      default: "",
    },
  },
  created() {},
  watch: {},
  mounted() {
    WWOpenData.bind(document.querySelector("ww-open-data"));
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
// 撤回消息
.revoke {
  background-color: #fff1e0;
  color: #ff9335;
  padding: 3px;
  border-radius: 5px;
  font-size: 12px;
}
.leftTime {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}
.otherInfo {
  float: left;
}
.aic {
  overflow: scroll;
}
.takecontent {
  width: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  ul li {
    display: flex;
    flex-direction: column;
  }
}
.imgSize {
  width: 40px;
  height: 40px;
  right: 8px;
  position: absolute;
}
</style>

<template>
  <div class="security">
    <el-tabs v-model="activeName">
      <el-tab-pane label="敏感词预警" name="1">
        <sensitive-list v-if="activeName == 1" />
      </el-tab-pane>
      <el-tab-pane label="敏感词设置" name="2">
        <set-sensitive-word  v-if="activeName == 2"/>
      </el-tab-pane>
      <!-- <el-tab-pane label="敏感行为警告" name="3">
        <alarming-sensitive />
      </el-tab-pane> -->
      <el-tab-pane label="员工白名单" name="4">
        <white-list v-if="activeName == 4" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import alarmingSensitive from "./alarmingSensitive.vue";
import sensitiveList from "./sensitiveList.vue";
import setSensitiveWord from "./setSensitiveWord.vue";
import whiteList from "./whiteList.vue";
export default {
  components: {
    sensitiveList,
    setSensitiveWord,
    alarmingSensitive,
    whiteList,
  },
  data() {
    return {
      activeName: "1",
    };
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // }
  },
};
</script>

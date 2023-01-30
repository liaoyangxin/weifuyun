<template>
  <div class="content">
    <el-tabs v-model="activeName">
      <el-tab-pane label="员工检索" name="1">
        <employee v-if="activeName == 1"></employee>
      </el-tab-pane>
      <el-tab-pane label="客户检索" name="2">
        <user v-if="activeName == 2"></user>
      </el-tab-pane>
      <el-tab-pane label="全局检索" name="3">
        <global v-if="activeName == 3"></global>
      </el-tab-pane>
      <el-tab-pane label="离职员工检索" name="4">
        <leave-employee v-if="activeName == 4" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import employee from "./employee.vue";
import user from "./customer.vue";
import global from "./global.vue";
import leaveEmployee from "./leaveEmployee.vue";
export default {
  components: { employee, user, global, leaveEmployee },
  data() {
    return {
      activeName: "1",
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>

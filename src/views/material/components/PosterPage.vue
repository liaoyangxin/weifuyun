
 <!--
<template>
  <div>
    <div ref="tuiImageEditor" style="width: 100%; height: 700px"></div>
    <select-material
      ref="selectMaterial"
      type="1"
      :showArr="[1]"
      :visible.sync="visible"
      @success="getMaterial"
    />
  </div>
</template>

<script>
export default {
  name: "PosterPage",
  components: {
    selectMaterial,
  },
  props: {
    btnContainer: null, // 自带按钮容器
    includeUi: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default() {
        return editorDefaultOptions;
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  destroyed() {},
  methods: {},
};
</script>
-->
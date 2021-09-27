<template>
  <el-button type="text" class="max" v-on="$listeners">
    {{ $t("swapControl.all1_btn") }}
  </el-button>
</template>
<script>
export default {
  name: "MaxButton",
};
</script>
<style lang="less" scoped>
.max {
  cursor: pointer;
  font-size: 14px;
  color: var(--col-main);
}
</style>

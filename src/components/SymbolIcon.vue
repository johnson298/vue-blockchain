<template>
  <div class="symbol-icon">
    <img v-if="token" :src="$icon(token)" alt="" />
  </div>
</template>

<script>
export default {
  name: "SymbolIcon",
  props: {
    token: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.symbol-icon {
  display: inline-flex;
  height: 100%;
  img {
    height: 100%;
  }
}
</style>

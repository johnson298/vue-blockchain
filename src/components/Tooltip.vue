<template>
  <el-tooltip effect="dark">
    <template v-slot:content>
      <div class="tooltip-content">
        {{ content }}
      </div>
    </template>
    <slot />
  </el-tooltip>
</template>
<script>
export default {
  props: ["content"],
  name: "Tooltip",
};
</script>
<style lang="less" scoped>
.tooltip-content {
  max-width: 300px;
}
</style>
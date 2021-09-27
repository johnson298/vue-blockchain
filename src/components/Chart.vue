<template>
  <div class="chart-item" ref="chart"></div>
</template>

<script>
import EC from "echarts";

export default {
  name: "Chart",
  props: {
    options: null,
  },
  watch: {
    options: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = EC.init(this.$refs.chart);
  },
  methods: {
    update() {
      // console.log(this.options, "options");
      this.chart.showLoading();
      this.chart.setOption(this.options);
      this.$nextTick(() => {
        this.chart.hideLoading();
      });
    },
  },
};
</script>

<style scoped>
.chart-item {
  height: 310px;
}
</style>

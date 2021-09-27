<template>
  <div class="parameter-asset-page">
    <p>
      <span class="left">{{ $t("governanceControl.feeSumtitle") }}</span>
      <span class="right">{{ totalReward }} {{ $project }}</span>
    </p>
    <p class="">
      <span class="left">{{ $t("governanceControl.stakeSumtitle") }}</span>
      <span class="right">{{ totalStake }} {{ $project }}</span>
    </p>
    <p class="">
      <span class="left">
        {{ $t("governanceControl.totalDgastitle") }}
      </span>
      <span class="right">{{ pool }} {{ $project }}</span>
    </p>
    <p class="">
      <span class="left">
        {{ $t("governanceControl.totalBurned") }}
      </span>
      <span class="right">{{ burn }} {{ $project }}</span>
    </p>
    <p class="">
      <span class="left">TotalSupply Of ERC20 Contract</span>
      <span class="right"> {{ totalSupply }} {{ name }} </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "GovernmentAsset",
  props: ["totalReward", "totalStake", "pool", "burn", "totalSupply","name"],
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.parameter-asset-page {
  min-height: 130px;
  background: var(--col-content);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 16px;
  border-radius: 10px;
  padding: 20px;

  p {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }

    .left {
      color: var(--col-label50);
    }

    .right {
      color: var(--col-main-active);
    }
  }
}

@media (max-width: 960px) {
  .parameter-asset-page {
  }
}
</style>

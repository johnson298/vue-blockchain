<template>
  <div class="mask-layer">
    <div class="mask-layer-content">
      <img class="token" src="@/assets/images/layer.logo.svg" alt="" />
      <div class="desc">COUNTOWN</div>
      <vac :end-time="date" @finish="$emit('finish')">
        <div class="timer" slot="process" slot-scope="{ timeObj }">
          <template v-for="(item, i) in split(timeObj)">
            <div :key="i">
              <span class="item">{{ item[0] }}</span>
              <span class="item">{{ item[1] }}</span>
              <span class="dot">:</span>
            </div>
          </template>
        </div>
        <span slot="finish"> done! </span>
      </vac>
    </div>
  </div>
</template>
<script>
import Logo from "./Logo.vue";
export default {
  name: "MaskLayer",
  data() {
    return {
      date:
        process.env.NODE_ENV !== "production"
          ? new Date()
          : new Date("2020/12/22 22:00:00"),
    };
  },
  methods: {
    split(timeObj) {
      const { h, m, s } = timeObj;
      return [h.split(""), m.split(""), s.split("")];
    },
  },
};
</script>
<style lang="less" scoped>
.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  background: url(~@/assets/images/layer.background.jpg) no-repeat center
    center/cover;
  z-index: 2020;
  .mask-layer-content {
    text-align: center;
    color: #fff;
    .token {
      width: 161px;
      margin-bottom: 132px;
    }
    .desc {
      font-size: 32px;
      margin-bottom: 60px;
    }
    .timer {
      display: flex;
      align-items: center;
      & > div {
        display: flex;
        flex-wrap: nowrap;
        .dot {
          margin: 0 10px;
          display: flex;
          align-items: center;
        }
        &:last-child {
          .dot {
            display: none;
          }
        }
      }
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 81px;
      height: 81px;
      background: #0f0b15;
      border-radius: 10px;
      font-size: 48px;
      & + .item {
        margin-left: 15px;
      }
    }
  }
}
</style>
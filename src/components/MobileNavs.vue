<template>
  <el-drawer
    size="50%"
    title="我是标题"
    :visible.sync="drawer"
    :with-header="false"
  >
    <div class="body">
      <div class="lang">
        <Language></Language>
      </div>
      <el-divider />
      <router-link
        :class="['link', { 'bottom-space': index < routes.length - 1 }]"
        v-for="(el, index) in routes"
        :key="el.path"
        :to="el.path"
        tag="li"
        :exact="el.extra"
      >
        {{ $t(el.title) }}
        <!--            <a-icon :class="{active:idx === index}" :type="el.icon" :space="true"/>-->
      </router-link>
      <!-- <el-divider/>
        <div class="media">
           <span class="faq">FAQ</span>
            <span class="medium" @click="win">Medium</span>
        </div>
        <el-divider/> -->
      <!-- <CornerMarker></CornerMarker> -->
    </div>
  </el-drawer>
</template>

<script>
import { routes } from "../router";
import CornerMarker from "./Corner-marker/Corner-marker";
import Language from "./Language/Language";
import { LINK } from "@/assets/js/link";

export default {
  name: "MobileNavs",
  components: {
    CornerMarker,
    Language,
  },
  data() {
    return {
      idx: 0,
      routes: routes,
      activeNames: ["1"],
    };
  },
  watch: {
    $route: {
      handler() {
        this.idx = routes.findIndex((d) => {
          return (
            d.path === this.$router.currentRoute.path ||
            (Array.isArray(d.includes) &&
              d.includes.indexOf(this.$router.currentRoute.name) > -1)
          );
        });
      },
      immediate: true,
    },
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("drawer", val);
      },
    },
  },
  methods: {
    handleChange(val) {
      // console.log(val);
    },
    win() {
      window.open(LINK.medium);
    },
  },
};
</script>

<style lang="less" scoped>
.body {
  background-color: var(--col-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 60px;

  .link {
    font-size: 36px;
    width: 100%;
    display: flex;
    justify-content: center;
    color: var(--col-label);
    &.router-link-active {
      color: var(--col-borrow);
    }
  }

  .bottom-space {
    margin-bottom: 80px;
  }

  .media {
    width: 100%;
    height: 225px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    color: var(--col-label);

    .medium,
    .faq {
      padding: 10px 0;
    }
  }
}
</style>

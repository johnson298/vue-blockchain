<template>
  <div class="body-main">
    <mask-layer @finish="finish" v-if="isHide" />
    <a-icon-store />
    <el-container class="_container">
      <el-header height="auto">
        <Top :isHome="isHome" @menu-send="menu" />
      </el-header>
      <el-container class="_main-container">
        <el-aside :class="['_slide', { '_close-slide': isCollapse }]">
          <NavLink :isCollapse="isCollapse" @mobile="mobile" :lang="lang" />
          <slide-lang
            :isCollapse="isCollapse"
            @setting="settingClick"
            @lang="setLang"
          ></slide-lang>
        </el-aside>
        <el-container
          class="_ov-hd"
          id="body-contion"
          :class="[
            {
              'shack-bg': routePath === '/shack',
              'prediction-bg': routePath === '/prediction',
            },
          ]"
        >
          <el-main :class="{ maxHeight: prediction }" id="el-main">
            <div
              :class="[
                {
                  '_max-wd': ifoWd,
                  '_farm-wd': farmWd,
                  '_max-100': prediction,
                },
              ]"
              style="min-height: 97%; position: relative"
            >
              <router-view v-if="isRouterAlive" />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Total from "@/components/Total/Total";
import NavLink from "./components/nav-link";

import Top from "./components/top/top";
import Tab from "./components/tab/tab";
import FooterPage from "./components/footer/footer";
import { mapState } from "vuex";
import MobileNavs from "./components/MobileNavs";
import { Subscription } from "rxjs";
import { $storage } from "@/assets/storage";
import MaskLayer from "./components/MaskLayer.vue";
import SlideLang from "./components/slide-lang";
import ChainApi from "../static/sdk/ChainApi";
import { SwapInstance } from "./assets/swap.init";

export default {
  components: {
    SlideLang,
    MobileNavs,
    Top,
    FooterPage,
    NavLink,
    MaskLayer,
    Tab,
    Total,
  },
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.routePath = val.path;
        this.isHome = val.name === "Home";
        this.ifoWd = ["/shack"].includes(val.path);
        this.farmWd = ["/ifo", "/farms", "/shack", "/xburger-pool"].includes(
          val.path
        );
        this.prediction = ["/prediction", "/test"].includes(val.path);
        // if (val.path !== '/transit') this.isBSCChain()
      },
      deep: true,
    },
  },
  data() {
    return {
      isRouterAlive: true,
      isHide: false,
      isHome: false,
      isCollapse: false,
      ifoWd: false,
      farmWd: false,
      routePath: "",
      lang: "EN",
      prediction: false,
    };
  },
  mounted() {
    document.getElementById("screen-loading").style.display = "none";
    this.init();
    this._sub = this.sub();
    this.$store.state.rootEl.classList.add(this.$store.getters.theme);
    // ChainApi.connect(type).then((acc) => {
    //     SwapInstance.onInit(ChainApi.web3());
    // }).finally(() => {
    // });
  },
  methods: {
    menu($event) {
      this.isCollapse = !this.isCollapse;
    },
    finish() {
      this.isHide = false;
    },
    isBSCChain() {
      this.$swap.loginStatus().subscribe((isLogin) => {
        if (isLogin && !SwapInstance.$provider.isBscNet()) {
          this.$aprilDialog.show({
              title: this.$t('Base.SwitchChain'),
              tip: this.$t('Base.SwitchChainTip')
          })
        }
      });
    },
    reload() {
      sessionStorage.clear();
      window.location.reload();
    },
    init() {
      if (this.isInstall) {
        this.queryPoolList();
      }

      if (window.innerWidth < 768) {
        this.isCollapse = true;
      }
    },
    queryPoolList() {
      this.$store.dispatch("poolList");
    },
    sub() {
      const sub = new Subscription();
      sub.add(
        this.$swap.accountStatusObservable.subscribe((account) => {
          if (account !== $storage.get("Account")) {
            this.$store.commit("clearActionCache");
            $storage.set("Account", account);
          }
        })
      );
      sub.add(
        this.$swap.handleCallbackSub.subscribe((d) => {
          this.$store.commit("pushActionCache", d);
          if (d.code === 1) {
            this.$swap.updateObservable.next();
          }
        })
      );
      sub.add(
        this.$swap.chainId().subscribe((id) => {
          // console.log('id::', id);
          this.$store.commit("chainId", Number(id));
        })
      );
      return sub;
    },
    mobile() {
      if (this.isCollapse) {
        this.isCollapse = false;
      }
      if (window.innerWidth < 768) {
        this.isCollapse = true;
      }
    },
    settingClick() {
      this.isCollapse = false;
    },
    setLang($event) {
      console.log("this lang", $event);
      this.lang = $event;
    },
  },
  computed: {
    ...mapState(["phone", "isInstall", "isConnect", "actionRecordMap"]),
  },
  destroyed() {
    this._sub && this._sub.unsubscribe();
  },
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  padding: 120px 0 64px;
  color: var(--col-main-active);
}
.maxHeight {
  padding-bottom: 0 !important;
}

._slide {
  background-color: #1f2226;
  transition: all 0.2s;
  position: relative;
  border-right: 1px solid #343e4a;
  width: 256px !important;
  overflow: hidden;
}

/deep/ .el-menu--collapse {
  width: 66px !important;
}

._close-slide {
  width: 66px !important;

  /deep/ ._menu-text {
    display: none;
  }

  /deep/ .el-menu--collapse > .el-submenu > .el-submenu__title .icon,
  /deep/ .el-menu--collapse > .el-menu-item .icon {
    width: 20px;
    height: 16px;
    visibility: inherit;
    display: inline-flex;
    overflow: inherit;
    margin: 0;
  }

  /deep/ .el-submenu__title {
    /*justify-content: center;*/
  }

  /deep/ .el-tooltip {
    justify-content: flex-start !important;
    left: 4px !important;
  }
}

.el-header {
  padding: 0;
}

._container {
  height: 100%;

  .el-container {
    justify-content: center;
  }

  ._main-container {
    height: calc(100% - 100px);
  }

  ._ov-hd {
    overflow-y: auto;
  }

  .shack-bg {
    background: url("~img/stack-bg.svg") no-repeat;
    background-size: cover;
  }

  .prediction-bg {
    /*background: url("~img/stack-bg.svg") no-repeat;*/
    background-size: cover;
    display: block;
  }

  .el-main {
    padding: 80px 0;

    & > div {
      max-width: 645px;
      margin: 0 auto;

      &._max-wd {
        /*width: 1157px;*/
        max-width: 1157px;
      }

      &._farm-wd {
        max-width: 1084px;
      }

      &._max-100 {
        max-width: 100%;
        min-height: calc(100vh - 180px) !important;
      }
    }
  }
}

@media (max-width: 768px) {
  ._slide {
    position: fixed;
    left: 0;
    top: 100px;
    width: 100% !important;
    height: 100%;
    background-color: #2c3035;
    z-index: 9;
  }

  ._close-slide {
    width: 0 !important;
  }

  ._container {
    .el-main {
      padding: 60px 20px 0;
      &.maxHeight {
        padding: 60px 0 0;
      }
    }
  }
}
</style>

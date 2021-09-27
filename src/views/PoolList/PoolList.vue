<template>
    <div
        class="home"
        :style="{
      'min-height': data.length !== 0 ? data.length * 56 + 300 + 'px' : '400px',
    }"
    >
        <div class="header">
            <h3>{{ $t('FundPool.LockUp') }}</h3>
            <span>$ {{ $store.getters.total | toFixed(2) | toFormat }}</span>
        </div>
        <div class="body">
            <a-loading :loading="loading">
                <div class="currency-group">
                    <el-button
                        v-for="(item, key) in poolsMap"
                        :key="key"
                        :class="['tab-btn public-button-primary',
            {
              active: active === key,
              hot: $Subscript.hot.includes(key),
              new: $Subscript.new.includes(key),
            },
          ]"
                        @click="activeTab(key)"
                    >
          <span class="currency-btn">
            <symbol-icon class="token" :token="key"/>
            <span>{{ key }}</span>
          </span>
                    </el-button>
                </div>
                <H5Pool @linkPool="linkPool($event)" :poolList="data"></H5Pool>
            </a-loading>

            <Connect
                v-if="isOpen"
                :isInstall="isInstall"
                @closeModal="closeModal"
            ></Connect>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import Connect from '../../components/connect/connect';
    import H5Pool from './h5-pool';
    import LPSymbol from '../../components/LPSymbol';
    import SymbolIcon from '../../components/SymbolIcon.vue';

    export default {
        name: 'PoolList',
        components: {
            LPSymbol,
            Connect,
            H5Pool,
            SymbolIcon,
        },
        data() {
            return {
                //connect wallet pop-window
                isOpen: false,
                lockUpValue: 0,
                active: '',
            };
        },
        methods: {
            activeTab(key) {
                this.active = key;
                console.log(this.active);
            },
            linkPool($event) {
                this.handleJump($event.data, $event.type);
            },
            //jump
            handleJump(res, type) {
                if (this.isConnect) {
                    this.$router.push({
                        name: 'FundPool',
                        query: {
                            type: type,
                        },
                        params: {
                            supply: res.supplyTokenSymbol,
                            currency: `${res.lpToken0Symbol}-${res.lpToken1Symbol}`,
                        },
                    });
                } else {
                    this.isOpen = true;
                }
            },
            // close wallet pop-window
            closeModal(res) {
                this.isOpen = res;
            },
        },
        watch: {
            poolsMap: {
                handler(val) {
                    if (!this.active) {
                        const d = Object.keys(val);
                        d.length && (this.active = d[0]);
                    }
                },
                immediate: true,
            },
        },
        computed: {
            ...mapState(['isConnect', 'isInstall', 'account', 'poolList', 'loading']),
            ...mapGetters(['poolsMap']),
            data() {
                return this.active ? this.poolsMap[this.active] : [];
            },
        },
        mounted() {

        },
    };
</script>
<style lang="less" scoped>
    .home {
        height: 100%;

        .header {
            height: 84px;
            box-sizing: border-box;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            align-items: center;
            background: rgba(240, 184, 11, 0.05);;

            h3 {
                font-size: 16px;
                color: var(--col-main-active);
            }

            span {
                font-size: 16px;
                color: var(--col-main);
            }
        }

        .currency-group {
            margin: 30px 0 20px 0;

            .currency-btn {
                display: flex;
                align-items: center;
                justify-content: center;

                &:not(:last-child) {
                    margin-right: 10px;
                }
            }

            .tab-btn {
                width: auto;
                background-position: top right;
                background-repeat: no-repeat;

                &.hot {
                    background-image: url("../../assets/images/hot.svg");
                }

                &.new {
                    background: url("../../assets/images/new.svg") no-repeat top right;
                }

                .a-icon {
                    font-size: 18px;
                }
            }

            .token {
                height: 16px;
                margin-right: 10px;
            }
        }
    }
</style>


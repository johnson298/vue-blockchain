<template>
<div class="_slide-bt">
    <div :class="[{'_is-hide': isCollapse}]">
        <div class="_slide-dropdown _n-mg-bt-16">
            <div class="_link-lf" @click="openPrice('BURGER')">
                <img src="../assets/images/icons/BURGER.png" alt="">
                $<count-jump :val="price"/>
            </div>
        </div>

        <div class="_slide-dropdown">
            <div class="_link-lf" @click="openPrice('xBURGER')">
                <img src="../assets/images/icons/xBURGER.svg" alt="">
                $<count-jump :val="xPrice"/>
            </div>

            <el-dropdown trigger="click">
                <div class="_dropdown-link">
                    <div class="_link-rt">
                        <img :src="require(`../assets/images/${lang.toLowerCase()}.svg`)" alt="">
                        <span>{{lang}}</span>
                    </div>
                </div>
                <el-dropdown-menu slot="dropdown" class="_dropdown-mask">
                    <el-dropdown-item v-for="d in languages"
                        :class="{ active: d.key === $i18n.locale }">
                        <img
                            :key="d.key"
                            :src="d.svg"
                            alt=""
                            @click="setLang(d.key)"
                        />
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="_link">
            <template v-for="el in moreLink">
            <a :href="el.link" target="_blank">
                <img :src="el.src" alt="">
            </a>
            </template>
        </div>
    </div>

    <i :class="['el-icon-setting', {'_icon-set': isCollapse}]" @click="routerClick"></i>
</div>
</template>

<script>
import {Languages} from '@/i18n/langs';
import ChainApi from '../../static/sdk/ChainApi';
import BigNumber from 'bignumber.js';
import CountJump from './countJump/index';
import {mapState} from "vuex";

export default {
    name: 'slide-lang',
    components: {CountJump},
    props: ['isCollapse'],
    data() {
        return {
            moreLink: [
                {
                    src: require('../assets/images/icon-telegram.svg'),
                    link: 'https://t.me/burgerswap'
                },
                {
                    src: require('../assets/images/icon-twitter.svg'),
                    link: 'https://twitter.com/burger_swap'
                },
                {
                    src: require('../assets/images/icon-medium.svg'),
                    link: 'https://medium.com/burgerswapblog/introducing-burgerswap-a-democratized-amm-on-binance-smart-chain-ac19287b5a2a'
                },
                {
                    src: require('../assets/images/icon-github.svg'),
                    link: 'https://github.com/burgerswap-org'
                },
                {
                    src: require('../assets/images/icon-talk.svg'),
                    link: 'https://open.kakao.com/o/gQAMv1cd'
                }
            ],
            lang: 'EN',
            price: 100,
            xPrice: 0,
            timer: ''
        }
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
        }),
        languages() {
            return Languages;
        },
    },
    watch: {
        isConnect() {
            this.loopBurgerPrice();
        },
    },

    mounted() {
        this.init()
        this.loopBurgerPrice()
    },
    methods: {
        loopBurgerPrice(){
            clearInterval(this.timer)
            this.timer = setInterval(_ => {
                // if(this.isConnect) this.getBurgerPrice()
                // else clearInterval(this.timer)
                clearInterval(this.timer)
            }, 4000)
        },
        getBurgerPrice() {
            this.getXBurgerPrice()
            ChainApi.getBurgerPrice().then(res => {
                this.price = new BigNumber(10).toFixed(6);
            })
        },
        init() {
            const lang = localStorage.getItem('lang');
            this.lang = 'EN';
            if (lang) {
                this.lang = localStorage.getItem('lang').toUpperCase();
            }
            this.$emit('lang', this.lang);
        },
        setLang(locale) {
            this.$i18n.locale = locale;
            this.$store.commit('setLanguage', locale);
            localStorage.setItem('lang', locale);
            this.lang = locale.toUpperCase();
            this.$emit('lang', this.lang)
        },
        routerClick() {
            this.$emit('setting')
        },
        openPrice(name) {
            window.open(name === 'BURGER' ? 'https://bscscan.com/token/0xae9269f27437f0fcbc232d39ec814844a51d6b8f' : 'https://bscscan.com/token/0xAFE24E29Da7E9b3e8a25c9478376B6AD6AD788dD')
        },
        getXBurgerPrice() {
            ChainApi.xBurgerPrice().then(res => {
                this.xPrice = new BigNumber(res).toFixed(6)
            }).catch(e => {
                // console.log('e====>', e)
            })
        }
    }
}
</script>

<style scoped lang="less">
    ._slide-bt {
        position: absolute;
        left: 0;
        bottom: 0;
        /*background-color: #24282C;*/
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 48px 24px;
        border-top: 1px solid #343E4A;

        & > div {
            width: 100%;
            transition: all .2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
        }

        ._slide-dropdown {
            width: 100%;
            display: flex;
            justify-content: space-between;
            color: #F0B80B;

            ._link-lf {
                font-size: 16px;
                display: flex;
                align-items: center;
                cursor: pointer;

                img {
                    margin-right: 10px;
                }
            }

            ._link-rt {
                cursor: pointer;
                display: flex;
                align-items: center;
                color: #F0B80B;
                font-size: 16px;

                span {
                    display: inline-block;
                    width: 35px;
                    text-align: right;
                }
            }
        }

        a {
            font-size: 16px;
            margin-right: 20px;
        }

        img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }

        ._link {
            width: 100%;
            display: flex;
            margin-top: 27px;
            justify-content: center;
        }

        ._is-hide, .el-icon-setting {
            display: none;
        }

        ._icon-set {
            font-size: 20px;
            color: #F0B80B;
            cursor: pointer;
            display: block;
        }
    }

    @media (max-width: 768px) {
        ._slide-bt {
            position: relative;
        }
    }
</style>

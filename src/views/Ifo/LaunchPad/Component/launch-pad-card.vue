<template>
    <div class="_pad-card">
        <div class="card-list">
            <img src="../../../../assets/images/ifo/ifo-white.svg" alt="" class="_ifo-white"
                v-if="Number(item.whiteCount)>0">
            <card-image :imgUrl="item.content.imgUrl"></card-image>

            <state-tag :status="item.status" class="_tag"></state-tag>

            <template v-if="isEnd">
                <end-info
                    :poolAddress="item.pool"
                    :walletAddress="walletAddress"
                    :total-amount="item.totalAmount"
                    :raising-amount="item.raisingAmount"
                    class="_n-mg-tp-55 _n-mg-bt-20 _pd-24">
                </end-info>
            </template>
            <template v-else>
                <ifo-progress
                    v-if="!isOpen"
                    :percentage="comingPercentage"
                    :isOpen="isOpen"
                    :time="comingTime"
                    class="_n-mg-tp-55 _n-mg-bt-40 _pd-24">
                </ifo-progress>

                <ifo-progress
                    v-if="isOpen"
                    :percentage="openPercentage"
                    :isOpen="isOpen"
                    :time="openTime"
                    class="_n-mg-tp-55 _n-mg-bt-40 _pd-24">
                </ifo-progress>

                <IfoForm
                    :item="item"
                    :walletAddress="walletAddress"
                    :isOpen="!isOpen"
                    class="_n-mg-bt-20">
                </IfoForm>
            </template>


            <div class="_card-details"
                @click="detailsClick">
                {{!isHide ? $t('Ifo.details') : $t('Ifo.hide')}}
                <a-icon type="icon-down" :class="['icon', {'icon-': isHide}]"/>
            </div>

            <april-transition :show="!isHide" ref="transition">
                <project-info :data="item" class="_n-mg-tp-20 _pd-24"></project-info>
                <project-text
                    :desc="language === 'zh' ?  item.content.desc_zh : item.content.desc_en"
                    :url="item.content.url"
                    class="_pd-24"></project-text>
            </april-transition>
        </div>
    </div>
</template>

<script>
import IfoProgress from './ifo-progress';
import CardImage from './card-image';
import StateTag from './state-tag';
import IfoForm from './ifo-form';
import ProjectInfo from './project-info';
import ProjectText from './project-text';
import EndInfo from './end-info';
import mixin from '../../../../assets/js/mixin';
import {$storage} from '../../../../assets/storage';
import {mapGetters} from 'vuex';

export default {
    name: 'launch-pad-card',
    components: {
        EndInfo,
        ProjectText,
        ProjectInfo,
        IfoForm,
        CardImage,
        IfoProgress,
        StateTag
    },
    props: ['item', 'walletAddress'],
    computed: {
        ...mapGetters(['language']),
    },
    data() {
        return {
            lang: 'en',
            isEnd: false,
            isOpen: true,
            comingTime: {
                down: true,
                d: 0,
                h: 0,
                m: 0,
                s: 0
            },
            comingPercentage: 0,
            comingDenominator: null,
            comingTimer: null,
            comingTimer2: null,
            openTime: {
                down: true,
                d: 0,
                h: 0,
                m: 0,
                s: 0
            },
            openPercentage: 0,
            openDenominator: null,
            openTimer: null,
            openTimer2: null,
            isHide: false,
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.lang = $storage.get('lang') || 'en';
            this.comingDenominator = this.item.startTime - new Date(this.item.content.date).getTime();
            this.openDenominator = this.item.endTime - this.item.startTime;
            this.down();
        },
        down() {
            if ((new Date().getTime() < this.item.startTime) && (new Date().getTime() > new Date(this.item.content.date).getTime())) {
                this.isOpen = false;
                this.isEnd = false;
                this.getComingPercentage();
                // text
                this.comingTimer = setInterval(() => {
                    const coming = mixin.methods.counDown(new Date().getTime(), this.item.startTime, () => {
                        // window.location.reload();
                        this.$emit('update')
                        clearInterval(this.comingTimer);
                        clearInterval(this.comingTimer2);
                    });
                    this.comingTime = {...coming};
                }, 1000);
                // progress
                this.comingTimer2 = setInterval(() => {
                    this.getComingPercentage();
                }, 3600)
            }

            if ((new Date().getTime() > this.item.startTime) && (new Date().getTime() < this.item.endTime)) {
                this.isOpen = true;
                this.getOpenPercentage();
                // text
                this.openTimer = setInterval(() => {
                    const open = mixin.methods.counDown(new Date().getTime(), this.item.endTime, () => {
                        // window.location.reload();
                        this.$emit('update')
                        clearInterval(this.openTimer);
                        clearInterval(this.openTimer2)
                    });
                    this.openTime = {...open};
                }, 1000);
                // progress
                this.openTimer2 = setInterval(() => {
                    this.getOpenPercentage();
                }, 3600)
            }

            if (new Date().getTime() > this.item.endTime) {
                this.isEnd = true;
            }
        },

        getComingPercentage() {
            const currentTime = new Date().getTime();
            const num = (currentTime - new Date(this.item.content.date).getTime()) / this.comingDenominator * 100;
            this.comingPercentage = num >= 100 ? 100 : num;
            if (this.comingTimer2 && num >= 100) {
                clearInterval(this.comingTimer2);
            }
        },

        getOpenPercentage() {
            const currentTime = new Date().getTime();
            const num = (currentTime - this.item.startTime) / this.openDenominator * 100;
            this.openPercentage = num >= 100 ? 100 : num;
            if (this.openTimer2 && num >= 100) {
                clearInterval(this.openTimer2);
            }
        },

        detailsClick() {
            this.isHide = !this.isHide;
        }
    },
    destroyed() {
        clearInterval(this.comingTimer);
        clearInterval(this.comingTimer2);
        clearInterval(this.openTimer);
        clearInterval(this.openTimer2);
    }
}
</script>

<style scoped lang="less">
    ._pad-card {
        margin: 15px;

        h6 {
            font-size: 16px;
            text-align: center;
            margin: 0 0 35px 0;
            font-weight: 400;
        }

        ._pd-24 {
            padding: 0 24px;
        }

        .card-list {
            width: 436px;
            padding-bottom: 40px;
            border-radius: 20px;
            background-color: #2C3035;
            color: #ffffff;
            margin: 0 auto;
            overflow: hidden;
            position: relative;

            ._tag {
                position: absolute;
                left: 24px;
                top: 185px;
            }

            .transition-dom {
                overflow-y: hidden;
                transition: height .2s linear;
            }
        }

        ._ifo-white {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 2;
        }

        ._card-details {
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon {
                margin-left: 10px;
                margin-top: 2px;
                transition: all .3s;
            }

            .icon- {
                transform: rotate(180deg);
            }
        }

        ._info-test {
            padding: 0 24px;
            color: #FFFFFF;

            h5 {
                font-weight: 400;
                font-size: 16px;
                line-height: 16px;
                margin-bottom: 15px;
            }

            p {
                font-weight: 300;
                font-size: 16px;
                line-height: 24px;
                padding-bottom: 30px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 30px;
            }

            div {
                font-weight: 300;
                font-size: 16px;
                line-height: 16px;
                color: #FFFFFF;
                margin-bottom: 24px;

                &:nth-last-of-type(1) {
                    margin-bottom: 0;
                }

                a {
                    color: #F0B80B;
                }
            }
        }
    }
</style>

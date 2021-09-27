<template>
<div class="_farm-list">
    <div class="_list-one">
        <div>
            <div>
                <p>{{data.mintTokenSymbol || '--'}} {{$t('Ifo.farmPool')}}</p>
                <span v-if="data.status === 0" class="_com">{{$t('Ifo.comingSoon')}}</span>
                <span v-if="data.status === 1" class="_com">{{$t('Ifo.tag1')}}</span>
                <span v-if="data.status === 2" class="_end">{{$t('Ifo.tag2')}}</span>
            </div>
        </div>
        <div>
            {{data.intro || '--'}}
        </div>
    </div>
    <div class="_list-two">
        <div>
            <p>
                <span>{{$t('Ifo.totalRewards')}}</span>
                <span>{{$shiftedBy(data.mintTotal, -data.mintTokenDecimals) || '--'}} {{data.mintTokenSymbol}}</span>
            </p>
            <p>
                <span>{{$t('Ifo.farmingPeriod')}}</span>
                <span>{{data.startBlock || '--'}}</span>
            </p>
        </div>
    </div>
    <div class="_list-three">
        <div>
            <template v-if="data.status === 0">
            {{$t('Ifo.comingSoon')}}
            </template>
            <template v-else-if="data.status === 1">
            <p>{{$t('Ifo.comTimeTxt')}}</p>
            <p>
                <span>{{time.d}}</span>
                <span>D</span>
                <span>{{time.h}}</span>
                <span>H</span>
                <span>{{time.m}}</span>
                <span>M</span>
                <span>{{time.s}}</span>
                <span>S</span>
            </p>
            </template>
            <template v-else>
            {{$t('Ifo.endTimeTxt')}} {{data.finishBlockTime | moment('YYYY-MM-DD')}}
            </template>
        </div>
    </div>
</div>
</template>

<script>
import mixin from '../../../../assets/js/mixin';

export default {
    name: 'Farm-List',
    props: ['data'],
    data() {
        return {
            day: null,
            time: {
                down: true,
                d: '00',
                h: '00',
                m: '00',
                s: '00'
            },
            timer: null,
            tagFlag: false,
            startTime: 1616223600000,
            endTime: 1616482800000
        }
    },
    watch: {
        data: {
            handler() {
                clearInterval(this.timer);
                this.init();
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        init() {
            this.tagFlag = new Date().getTime() < this.data.finishBlockTime;
            console.log('this.data.finishBlockTime--->', this.data.finishBlockTime, this.data.startBlockTime)
            this.day = Math.floor((this.data.finishBlockTime - this.data.startBlockTime) / (1000 * 60 * 60 * 24));
            if (new Date().getTime() <= this.data.finishBlockTime) {
                this.timer = setInterval(() => {
                    const coming = mixin.methods.counDown(new Date().getTime(), this.data.finishBlockTime, () => {
                        window.location.reload();
                        clearInterval(this.timer);
                    });
                    this.time = {...coming};
                }, 1000);
            }
        }
    },
    destroyed() {
        clearInterval(this.timer)
    }
}
</script>

<style lang="less" scoped>
    ._farm-list {
        border-radius: 20px;
        background-color: #2C3035;
        margin-bottom: 36px;
        display: flex;
        justify-content: space-around;

        & > div {
            width: 33.33%;
            height: 164px;
            color: #ffffff;
            border-right: 1px solid rgba(#ffffff, .1);

            &:nth-last-child(1) {
                border-right: 0;
            }
        }

        ._list-one {
            display: flex;
            flex-wrap: wrap;

            & > div {
                width: 100%;

                &:nth-of-type(1) {
                    padding: 0 20px;
                    height: 94px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid rgba(#ffffff, .1);
                    flex-wrap: wrap;

                    p {
                        width: 100%;
                        font-size: 22px;
                        font-weight: bold;
                        margin-bottom: 16px;
                    }

                    span {
                        padding: 0 10px;
                        font-size: 14px;
                        border-radius: 4px;
                        height: 20px;
                        line-height: 20px;
                        display: inline-flex;

                        &._com {
                            background: linear-gradient(98.63deg, #F78029 0%, #FA5825 97.77%);
                            box-shadow: 0 0 10px rgba(25, 182, 252, 0.16);
                        }

                        &._end {
                            background: linear-gradient(90deg, #B3BCCA 0%, #AFB8C6 46.35%, #97A0AD 100%);
                            box-shadow: 0 0 10px rgba(229, 229, 229, 0.2);
                        }
                    }
                }

                &:nth-of-type(2) {
                    height: calc(100% - 94px);
                    padding: 16px 20px 0;
                    font-size: 14px;
                    line-height: 16px;
                    color: rgba(#ffffff, .6);
                    overflow-y: auto;
                    padding-bottom: 10px;
                }
            }
        }

        ._list-two {
            display: flex;
            align-items: center;
            justify-content: center;

            & > div {
                max-width: 100%;
                min-width: 60%;

                p {
                    display: flex;
                    justify-content: space-between;

                    &:nth-of-type(1) {
                        margin-bottom: 17px;
                    }

                    span {
                        color: #ffffff;
                        font-size: 14px;

                        &:nth-of-type(1) {
                            color: rgba(#ffffff, .6);
                        }
                    }
                }
            }
        }

        ._list-three {
            display: flex;
            align-items: center;
            justify-content: center;

            & > div {
                max-width: 100%;

                p {
                    font-size: 16px;
                    display: flex;

                    &:nth-of-type(1) {
                        margin-bottom: 17px;
                        color: #ffffff;
                    }

                    &:nth-of-type(2) {
                        span {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 32px;
                            height: 34px;
                            border-radius: 4px;
                            color: #ffffff;

                            &:nth-of-type(odd) {
                                background-color: #44494F;
                            }

                            &:nth-of-type(even) {
                                color: #62676D;
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        ._farm-list {
            flex-wrap: wrap;
            width: 340px;
            margin: 0 auto;
            margin-bottom: 50px;

            & > div {
                width: 100%;
                color: #ffffff;
                border-right: 0;
                border-bottom: 1px solid rgba(#ffffff, .1);

                &:nth-last-child(1) {
                    border-bottom: 0;
                }
            }

            ._list-one {
                display: flex;
                flex-wrap: wrap;

                & > div {
                    width: 100%;

                    &:nth-of-type(1) {
                        border-bottom: 0;
                    }
                }
            }

            ._list-two {
                & > div {
                    max-width: 100%;
                    min-width: 100%;
                    padding: 0 20px;
                }
            }

            ._list-three {
                & > div {
                    min-width: 100%;
                    padding: 0 20px;
                }
            }
        }
    }
</style>

<template>
    <div class="convert-record" v-if="convertList && convertList.length">
        <div class="title">
            {{ $t('Transit.ConvertTitle') }}
        </div>
        <div class="box" v-for="item in convertList" :key="item.tx_id">
            <div class="left">
                <img :src="ethIcon" alt="" style="z-index: 3"/>
                <div class="iconArrow">
                    <a-icon class="direction" type="icon-direct"/>
                </div>
                <img :src="bscIcon" alt="" style="z-index: 3"/>
            </div>
            <div class="center">
                {{
                    $t('Transit.ConvertRecord', {
                        amountIn: (Number(item.amountIn || 0).toFixed(6)),
                        token: item.token,
                        amountOut: Number(item.amountOut || 0).toFixed(6)
                    })
                }}
            </div>
            <div class="right">{{ $t(StatusMap[item.status]) }}</div>
        </div>
    </div>
</template>

<script>
import {bscIcon, ethIcon} from './images/index';
import {transitHelper} from '@/store/transit.module';

export default {
    name: 'ConvertRecords',
    computed: {
        ...transitHelper.mapGetters({
            'convertList': 'convertList'
        })
    },
    data() {
        return {
            ethIcon: ethIcon,
            bscIcon: bscIcon,
            StatusMap: {
                0: 'Transit.Processing',
                1: 'Transit.Completed',
            }
        };
    }

};
</script>

<style lang="less" scoped>
.convert-record {
    .title {
        font-size: 20px;
        font-weight: 700;
        color: var(--col-label60);
        margin: 20px 0 20px 0;
    }

    .box {
        width: 640px;
        height: 108px;
        background: #292D31;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        padding: 0 30px;
        margin-bottom: 20px;

    }

    .left {
        display: flex;
        align-items: center;

        .iconArrow {
            padding: 0 10px;
            color: var(--col-main);
            font-size: 24px;
        }

        img {
            height: 60px;
        }
    }

    .center {
        flex: 1;
        padding-left: 42px;
        color: rgba(255, 255, 255, 0.5);
    }

    .right {
        color: rgba(255, 255, 255, 0.5);
    }
}
</style>

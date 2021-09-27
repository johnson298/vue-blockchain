<template>
    <div class="SwapDetail" v-show="SwapState.swapInfo">
        <detail-inner labelClassName="labelColor" :from="from"/>
        <el-divider
            class="marginBottom20"
            style="background-color: rgba(10, 35, 96, 0.2)"
        />
        <div class="marginBottom20 path vCener">
      <span class="spaceRight">
        {{ $t('swapControl.Router') }}
      </span>
            <a-tooltip
                class="item"
                effect="dark"
                :content="$t('swapControl.proTxts.3')"
                placement="top-start"
            >
                <a-icon class="icon" type="icon-wenhao"/>
            </a-tooltip>
        </div>
        <div class="routes">
            <div v-for="(d, i) in pathArr" :key="i" class="tokenRoute">
                <img class="token" :src="d.icon" alt=""/>
                {{ d.symbol }}
            </div>
        </div>
    </div>
</template>
<script>
import {swapHelper} from '../../../store/swap.module';
import DetailInner from './DetailInner.vue';

export default {
    components: {DetailInner},
    name: 'SwapDetail',
    props: {
        label: '',
        from: ''
    },
    computed: {
        ...swapHelper.mapState(['SwapState']),
        ...swapHelper.mapGetters(['tokenMap']),
        pathArr() {
            return this.SwapState.swapInfo
                ? this.SwapState.swapInfo.path.map((p) => {
                    const matched = this.tokenMap[p.toLowerCase()];
                    return {
                        symbol: matched?.symbol,
                        icon: this.$icon(matched),
                    };
                })
                : [];
        },
    },
};
</script>
<style lang="less" scoped>
.SwapDetail {
    margin-top: 30px;
    border: 1px dashed var(--col-main);
    border-radius: 10px;
    padding: 20px;
    color: #fff;
    margin-bottom: 120px;
}

.spaceRight {
    margin-right: 20px;
    color: #1e2226;
}

.marginBottom20 {
    margin-bottom: 20px;
    .spaceRight {
        margin-right: 20px;
        color: var(--col-main-active);
    }
}

.labelColor {
    color: var(--col-font);
}

.path {
    font-weight: bold;
    font-size: 16px;
}

.vCener {
    display: flex;
    align-items: center;
}

.routes {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tokenRoute {
    margin-bottom: 10px;

    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    position: relative;
    padding-right: 30px;

    &:not(:last-child) {
        margin-right: 80px;

        &::after {
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            content: "······";
            color: var(--col-main);
            font-size: 20px;
        }
    }

    .token {
        width: 30px;
        margin-right: 20px;
    }
}
</style>

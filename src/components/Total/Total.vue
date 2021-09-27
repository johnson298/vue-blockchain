<template>
    <div class="total-vol">
        <div class="left">
<!--            <div class="top">{{ volList.daySwap | toFixed(0) | toFormat }}</div>-->
<!--            <div class="bottom">{{ $t('MainView.vol') }}</div>-->
        </div>
        <div class="right">
<!--            <div class="top">{{ volList.currentLiquidity | toFixed(0) | toFormat }}</div>-->
<!--            <div class="bottom">{{ $t('MainView.liq') }}</div>-->
        </div>
    </div>
</template>

<script>
export default {
    name: 'Total',
    data() {
        return {
            volList: {
                daySwap: '',
                currentLiquidity: '',
            },
            timer: null
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.timer = setTimeout(() => {
                this.$store.dispatch('governance/getGlobalInfo').then(res => {
                    if (res && res.data) {
                        this.volList.daySwap = res.data.daySwap;
                        this.volList.currentLiquidity = res.data.currentLiquidity;
                    }
                });
            }, 5000);
        }
    },
    destroyed() {
        this.timer && clearTimeout(this.timer);
    }
};
</script>

<style lang="less" scoped>
.total-vol {
    height: 80px;
    display: flex;
    justify-content: space-between;

    .left, .right {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .top {
        font-size: 48px;
        color: var(--col-main);
        margin-bottom: 20px;
    }

    .bottom {
        font-size: 14px;
        color: var(--col-main-active);
    }
}
</style>

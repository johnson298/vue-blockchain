<template>
    <el-dialog class="dialog-madel" :visible="open" @close="close">
        <div class="img">
            <img :src="type === 'ETHBSC' || type === 'ConvertETH2BSC' ? ethIcon : type === 'BSCETH' ? bscIcon : ''"
                 alt="" style="z-index: 3"/>
            <div class="iconArrow">
                <a-icon class="direction" type="icon-direct"/>
            </div>
            <img :src="type === 'ETHBSC' || type === 'ConvertETH2BSC' ? bscIcon : type === 'BSCETH' ? ethIcon : ''"
                 alt="" style="z-index: 3"/>
        </div>
        <div class="title">
            {{ type === 'ETHBSC' ? $t('Transition success') : type === 'BSCETH' ? $t('Transit.ConvertSuccess') : type === 'ConvertETH2BSC' ? $t('Transit.ConvertSuccess') : '' }}
        </div>
        <div class="footer">
            {{ type === 'ETHBSC' ? 'Please change your wallet network into Binance Smart Chain to receive your transit assets' : type === 'BSCETH' ? $t('Transit.ConvertDesc') : type === 'ConvertETH2BSC' ? $t('Transit.ConvertDesc') : '' }}
        </div>
    </el-dialog>
</template>

<script>
import {bscIcon, ethIcon} from './images/index';

export default {
    name: 'ETH2BSC',
    computed: {},
    props: {
        open: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: '',
        },

    },
    data() {
        return {
            ethIcon: ethIcon,
            bscIcon: bscIcon
        };
    },
    methods: {
        triggerClose(d) {
            this.$emit('update:open', false);
        },
        close() {
            this.triggerClose();
        },
    },
};
</script>

<style lang="less" scoped>
.img {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 80px;
    }

    margin-bottom: 80px;
}

.iconArrow {
    .direction {
        color: var(--col-main);
        font-size: 30px;
        padding: 0 20px;
    }
}

.title {
    font-size: 24px;
    color: #1E2226;
    font-weight: 700;
    text-align: center;
}

.footer {
    font-size: 16px;
    color: #1E2226;
    text-align: center;
    margin: 10px 0 62px 0;
}
</style>

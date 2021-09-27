<template>
    <swap-modal :open.sync="open">
        <div class="modal-wrapper">
            <template v-if="!status">
                <img src="../images/loading.gif" alt="" width="150px"/>
                <div class="title">Waiting for confirmation</div>
                <div>
                    Swapping {{ from }} {{ fromToken }} for {{ to }} {{ toToken }}
                </div>
                <div class="tip">Confirm this transaction in your wallet</div>
            </template>
            <template v-else>
                <img src="../images/success.svg" alt="" style="margin-bottom: 20px;"/>
                <div class="title">Transaction submitted</div>
                <div>
                    Swapping {{ from }} {{ fromToken }} for {{ to }} {{ toToken }}
                </div>
                <div class="tip">
                    <a target="_blank" :href="$swap.getBscscanTx(address)">
                        {{ $t('submit.View') }}
                    </a>
                </div>
            </template>
        </div>
    </swap-modal>
</template>
<script>
import SwapModal from './SwapModal.vue';

export default {
    name: 'StatusModal',
    components: {SwapModal},
    props: ['from', 'to', 'fromToken', 'toToken', 'address'],
    data() {
        return {
            open: false,
            status: false,
        };
    },
    methods: {
        toggle(status) {
            this.open = Boolean(status) || !this.open;
        },
        setStatus(status) {
            if (!this.open) this.open = true;
            this.status = Boolean(status) || !this.status;
        },
    },
};
</script>
<style lang="less" scoped>
.modal-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
}

.icon {
    font-size: 130px;
    margin-bottom: 30px;
}

.title {
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 10px;
}

.tip {
    margin-top: 15px;

    a {
        color: var(--col-main);
    }
}
</style>

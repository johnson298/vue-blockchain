<template>
    <div>
        <div class="_token">
            <span>{{$t('Ifo.partakeToken')}}</span>
            <span>{{symbol1 ? symbol0 + '-' +symbol1 + ' LP' : symbol0}}</span>
        </div>
        <div class="_token _mg-tp-20">
            <span>{{$t('Ifo.percentage')}}</span>
            <span>{{(Number(totalAmount)/Number(raisingAmount)*100).toFixed(2) || '--'}}%</span>
        </div>
        <template v-if="isCommitted">
            <div class="_token _mg-tp-20">
                <span>{{$t('Ifo.useCommitted')}}</span>
                <span>{{useCommitted}}</span>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'token',
    props: ['symbol0', 'symbol1', 'useCommitted', 'isCommitted', 'totalAmount', 'raisingAmount']
}
</script>

<style scoped>
    ._token {
        display: flex;
        justify-content: space-between;
        color: #ffffff;
        font-size: 16px;
        font-weight: 500;
    }

    ._mg-tp-20 {
        margin-top: 20px;
    }
</style>

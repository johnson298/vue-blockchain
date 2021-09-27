<template>
<div class="_empty">
    <div>
        <img src="../assets/images/empty.svg" alt="">
    </div>
    <p>{{$t('Ifo.noData')}}</p>
</div>
</template>

<script>
export default {
    name: 'Empty'
}
</script>

<style scoped lang="less">
    ._empty {
        padding-top: 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 16px;
        color: rgba(#ffffff, .6);

        img {
            width: 195px;
            height: 104px;
        }

        p {
            width: 100%;
            text-align: center;
            margin-top: 20px;
        }
    }
</style>

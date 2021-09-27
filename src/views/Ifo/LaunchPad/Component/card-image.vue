<template>
<div class="card-img">
    <img :src="imgUrl" alt="">
</div>
</template>

<script>
export default {
    name: 'card-image',
    props: ['imgUrl'],
}
</script>

<style scoped lang="less">
    .card-img {
        width: 100%;
        height: 200px;
        padding: 0;
    }
    .card-img img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
    }
</style>

<template>
<div class="_ifo-title">
    <h1>{{title}}</h1>
    <h5>{{subTitle}}</h5>
</div>
</template>

<script>
export default {
    name: 'ifo-title',
    props: ['title', 'subTitle']
}
</script>

<style scoped lang="less">
    ._ifo-title {
        color: var(--col-main-active);
        display: block;
        margin-bottom: 60px;

        h1 {
            font-size: 32px;
            font-weight: 500;
            margin: 0;
            text-align: center;
            width: 100%;
        }

        h5 {
            font-size: 16px;
            color: rgba(#FFFFFF, .6);
            text-align: center;
            width: 100%;
            margin-bottom: 0;
        }
    }
</style>

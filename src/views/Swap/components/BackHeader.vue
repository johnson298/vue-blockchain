<template>
    <h3 class="back-header">
        <div class="back-header-content" v-on="$listeners">
            <a-icon class="icon" type="icon-arrow-left"/>
            {{ title }}
        </div>
        <slot/>
    </h3>
</template>
<script>
export default {
    name: 'BackHeader',
    props: ['title'],
};
</script>
<style lang="less" scoped>
.back-header {
    font-weight: bold;
    font-size: 24px;
    display: flex;
    margin-bottom: 40px;

    .back-header-content {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .icon,
    .back-header-content {
        margin-right: 20px;
        color: #fff;
    }
}
</style>

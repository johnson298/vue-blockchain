<template>
    <div>
<!--        <NavLink :type="'lend'"/>-->
        <router-view/>
    </div>
</template>
<script>

import NavLink from './nav-link';
export default {
    components: {
        NavLink
    },
    name: 'Layout',
};
</script>
<style lang="less" scoped>
</style>

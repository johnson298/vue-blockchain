<template>
    <div class="home">
        <BMyDataTitle></BMyDataTitle>
        <BTrade></BTrade>
    </div>
</template>

<script>
import BMyDataTitle from './BMyDataTitle';
import BTrade from './BTrade';

export default {
    name: 'Home',
    components: {BMyDataTitle, BTrade},
    data() {
        return {};
    }
};
</script>

<style lang="less" scoped>
.home {

}
</style>

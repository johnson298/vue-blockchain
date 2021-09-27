<template>
<div class="swap-pool">
    <component :is="viewName" @view="viewToggle" :props="props"/>
</div>
</template>
<script>
import {swapHelper} from '@/store/swap.module';
import AddLiquidity from './components/AddLiquidity.vue';
import PoolIndex from './components/PoolIndex.vue';
import RemoveLiquidity from './components/RemoveLiquidity.vue';

export default {
    components: {AddLiquidity, PoolIndex, RemoveLiquidity},
    name: 'SwapPool',
    provide() {
        return {
            viewToggle: this.viewToggle,
        };
    },
    data() {
        return {
            viewName: 'PoolIndex',
            props: undefined,
        };
    },
    computed: {
        ...swapHelper.mapState(['liquidityList']),
        // ...swapHelper.mapGetters({
        //     'ver': 'ver',
        //     'liquidityList': 'liquidityList'
        // })
    },
    created() {
        this.$store.commit('swap/setVer', 2);
    },
    mounted() {
        if (this.$route.path === '/trade/pool' && this.$route.query.from && this.$route.query.to) {
            this.viewToggle('AddLiquidity', undefined)
        }
        this.$swap.loginStatus().subscribe(isLogin => {
            if (isLogin) {
                console.log('logined fetchTokens...')
                this.$store.dispatch('swap/fetchTokens', 2);
            }
        });
    },
    methods: {
        viewToggle(componentName = 'PoolIndex', props = undefined) {
            console.log()
            this.viewName = componentName;
            this.props = props;
        },
    },
};
</script>
<style lang="less" scoped>
    .swap-pool {
        //color: #0a2360;
    }
</style>

<template>
    <div>
        <Asset
            v-for="(item, i) in list"
            :key="i"
            :type="'pledge'"
            :total="item.pledgeUSDT"
        >
            <template v-slot:title>
                <LPSymbol :imgHide="true" :pool="item"/>
            </template>
        </Asset>
    </div>
</template>

<script>
import Asset from './asset';
import LPSymbol from '../../components/LPSymbol';
import ChainApi from '../../../static/sdk/ChainApi';
import {mapState} from 'vuex';

export default {
    components: {
        LPSymbol,
        Asset,
    },
    props: ['list'],
    name: 'pledge',
    data() {
        return {
            // pledgeList: [],
            // lpTokenUSDT: '',
        };
    },
    computed: {
        ...mapState({
            isConnect: 'isConnect',
            account: 'account',
            poolList: 'poolList',
        }),
    },
    watch: {
        // isConnect() {
        //     this.init();
        // },
        // poolList: {
        //     handler() {
        //         this.init();
        //     },
        //     immediate: true
        // },
    },
    methods: {
        // init() {
        // this.getLoan();
        // },
        // getLoan() {
        //     Promise.all(this.poolList.map(d => {
        //         return ChainApi.pledgePrice(d.pair).then((pledgePrice) => {
        //             return ChainApi.borrows(d.pair).then((borr) => {
        //                 return {
        //                     pool: d,
        //                     pledgePrice: pledgePrice,
        //                     borr: borr
        //                 };
        //             });
        //         });
        //     })).then(([...arg]) => {
        //         let valUSDT = 0;
        //         this.pledgeList = arg.map((data, i) => {
        //             const {borr, pool, pledgePrice} = data;
        //             const pledgeUSDT = this.$number(borr.amountCollateral)
        //                 .shiftedBy(-pool.collateralTokenDecimals).multipliedBy(pledgePrice)
        //                 .toNumber();
        //             valUSDT += pledgeUSDT;
        //             return {
        //                 pledgeUSDT,
        //                 ...this.poolList[i]
        //             }
        //         });
        //         this.lpTokenUSDT = valUSDT;
        //         this.$store.commit('myAccount/LPTotal', this.lpTokenUSDT)
        //     });
        // },
    },
};
</script>

<style scoped>
</style>

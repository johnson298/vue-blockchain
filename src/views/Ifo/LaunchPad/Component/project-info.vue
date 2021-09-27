<template>
<ul class="_project-info">
    <li>
        <span>{{$t('Ifo.startTime')}}</span>
        <span>{{data.startTime | moment('YYYY MM.DD HH:mm')}} UTC</span>
    </li>
    <li>
        <span>{{$t('Ifo.raiseAmountUSD')}}</span>
        <span>$<count-jump :val="data.content.raiseAmountUSD" isFormat=true /></span>
    </li>
    <li>
        <span>{{$t('Ifo.ifoAmount')}}</span>
        <span><count-jump :val="offeringAmount" isFormat=true /></span>
    </li>
    <li v-if="data.status != 2">
        <span>{{$t('Ifo.pricePer', {token: data.offeringTokenSymbol})}}</span>
        <span>$<count-jump :val="data.content.price" /></span>
    </li>
</ul>
</template>

<script>
import CountJump from "../../../../components/countJump/index";
export default {
    name: 'project-info',
    components: {CountJump},
    props: ['data'],
    data(){
        return{
            offeringAmount: this.$shiftedBy(this.data.offeringAmount, -this.data.offeringTokenDecimals).toFixed(2)
        }
    }
}
</script>

<style scoped lang="less">
    ._project-info {
        li {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;

            span {
                font-size: 14px;
                &:nth-of-type(1) {
                    color: rgba(#ffffff, .6);
                }
            }

            &:nth-last-child(1) {
                padding-bottom: 30px;
                margin-bottom: 0;
                border-bottom: 1px solid rgba(#ffffff, .1);
            }
        }
    }
</style>

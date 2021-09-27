<template>
<div class="transit">
    <div class="title">
        {{ $t('Transit.TransitBtn') }}
    </div>
    <TransitGroup
        :ETH="true"
        :tokensList="tokensList"
        :mask="isBSC"
        :spender="ETHBurgerAddress"
        :title="'Transit.BSCTip'"
        :label="'ERC20 to BEP20'"
        :button="'Transit.TransitBtn'"
    >
        <GasStation v-if="!(showGasStation && isConvert)" :spender="ETHBurgerAddress"
            :mask="isETH"></GasStation>

    </TransitGroup>

    <TransitGroup
        :ETH="false"
        :tokensList="[]"
        :mask="isETH"
        :spender="BSCBurgerAddress"
        :title="'Transit.ETHTip'"
        :button="'Transit.RedeemBtn'"
        :label="'BEP20 to ERC20'"
    ></TransitGroup>

    <!--        <TransitWarnTip :isETH="isETH"></TransitWarnTip>-->

    <!--        <ConvertRecords></ConvertRecords>-->

    <div class="transit-title">
        {{ $t('Transit.ListTitle') }}

        <div class="_transit-verify">
            <el-input v-model.trim="val"
                :placeholder="isETH ? $t('Transit.hashTipBsc') : $t('Transit.hashTipEth')"></el-input>
            <el-button class="_n-btn" :loading="load" @click="submitClick"
                :disabled="val === '' || val === null">{{$t('Transit.hashTipSubmit')}}
            </el-button>
        </div>
    </div>

    <PayBackRecord v-if="isETH" :data="data"/>
    <Transitrecords v-if="!isETH" :data="data"/>

    <BridgeNote v-if="isBSC"></BridgeNote>
    <div class="bsc-top" v-if="isBSC">
        {{ $t('Transit.Tip.4') }}
    </div>
    <HashTip :visible="visible" :code="code" :msg="msg" @cancel="cancel"/>
</div>
</template>

<script>
import GasStation from '@/views/Transit/GasStation';
import TransitGroup from '@/views/Transit/TransitGroup';
import {mapState, mapGetters} from 'vuex';
import TransitWarnTip from '@/views/Transit/TransitWarnTip';
import ConvertRecords from '@/views/Transit/ConvertRecords';
import BridgeNote from '@/views/Transit/BridgeNote';
import PayBackRecord from '@/views/Transit/PayBackRecord';
import Transitrecords from '@/views/Transit/Transitrecords';
import {interval, Subscription, timer} from 'rxjs';
import {takeWhile} from 'rxjs/operators';
import {transitHelper} from '@/store/transit.module';
import {SwapInstance} from '@/assets/swap.init';
import HashTip from './hash-tip'

export default {
    components: {
        TransitGroup,
        GasStation,
        TransitWarnTip,
        ConvertRecords,
        Transitrecords,
        PayBackRecord,
        BridgeNote,
        HashTip
    },
    name: 'Transit',
    data() {
        return {
            isETH: false,
            isBSC: false,
            ETHBurgerAddress: '',
            BSCBurgerAddress: '',
            tokensList: [],
            showGasStation: false,
            _sub: new Subscription(),
            val: null,
            load: false,
            visible: false,
            code: null,
            msg: null,
            update: false,
            data: null,
        };
    },
    watch: {
        chainId: {
            handler(val) {
                val = Number(val);
                console.log('val:val', val);
            },
            immediate: true,
        },
    },
    computed: {
        ...mapState(['chainId']),
        ...transitHelper.mapGetters({
            'convertList': 'convertList',
            isConvert: 'isConvert'
        })
    },
    mounted() {
        // this.$aprilDialog.show({
        //     tip: '<p style="text-align: left; line-height: 1.4">' + this.$t('Base.Btoken') + '</br>' +
        //         ' <p style="margin-top: 30px">' + this.$t('Base.BtokenTip') + '</p></p>'
        // })
        this.init();
    },
    methods: {
        init() {
            this.$swap.loginStatus().subscribe(isLogin => {
                if (isLogin) {
                    this.isETH = this.$swap.$provider.isEthNet();
                    this.isBSC = this.$swap.$provider.isBscNet();
                    if (this.isETH) {
                        this.ETHBurgerAddress = this.$swap.$provider.getETHBurgerTransitAddress();
                        this.$store.dispatch('transit/checkConvert');
                    }
                    if (this.isBSC) {
                        this.BSCBurgerAddress = this.$swap.$provider.getBscBurgerTransitAddress();
                    }
                    this.$swap.getConvertList().subscribe(data => {
                        this.$store.commit('transit/setConvertList', data);
                        console.log('getConvertList:', data);
                        this.showGasStation = data.length > 0 && data.find(f => f.status === 1);
                    });
                }
                this.$store.dispatch('transit/uniSwap').then(res => {
                    this.tokensList = res;
                    // console.log('uniSwap token list:', res)
                });
            });
        },
        submitClick() {
            this.load = true;
            console.error(this.val, this.val.indexOf('0x'));
            if(this.val.indexOf('0x') === -1){
                const res = {
                    code: 3,
                }
                this.setData(res);
                return
            }

            if (this.isBSC) {
                SwapInstance.getEThTx(this.val).then(res => {
                    this.setData(res);
                })
            }
            if (this.isETH) {
                SwapInstance.getBscTx(this.val).then(res => {
                    this.setData(res);
                })
            }
        },
        setData(res) {
            this.load = false;
            this.visible = true;
            this.code = res.code;
            this.msg = res.msg;
            this.data = res.code === 0 ? res.data : null;
        },
        cancel() {
            this.visible = false;
        }
    },
    destroyed() {
        this._sub && this._sub.unsubscribe();
    }
};
</script>

<style lang="less" scoped>
    .transit {
        padding-bottom: 120px;

        .title {
            height: 68px;
            text-align: center;
            line-height: 68px;
            font-size: 22px;
            color: var(--col-main);
            background: rgba(240, 184, 11, 0.05);
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .bsc-top {
            color: #f0b80b;
            background-color: rgba(240, 184, 11, 0.05);
            padding: 20px 30px;
            border-radius: 10px;
            margin-bottom: 40px;
            font-size: 16px;
            line-height: 20px;
        }
    }

    .transit-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--col-main);
        margin: 20px 0 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    ._transit-verify {
        width: 400px;
        display: flex;

        ::v-deep .el-input {
            height: 30px;
            margin-right: 10px;

            input {
                border-radius: 4px;
                background-color: #292d31 !important;
                color: #fff !important;
                border: 1px solid rgba(255, 255, 255, 0.5);
            }
        }

        ._n-btn {
            font-size: 14px;
            color: #1e2226;

            &:disabled {
                background: #292d31 !important;
                color: var(--col-label60) !important;
            }
        }
    }

</style>

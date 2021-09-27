<template>
<el-row :gutter="10">
    <el-col :span="notApproved ? 12 : 0">
        <el-button
            :loading="approving"
            :disabled="!isConnect"
            class="public-button-dark __button"
            @click="approve(token)"
        >
            {{ $t('Button.Authorization') }} &nbsp; {{ token | pick('symbol') }}
        </el-button>
    </el-col>
    <el-col :span="notApproved ? 12 : 24">
        <slot v-bind:disabled="notApproved"/>
    </el-col>
</el-row>
</template>

<script>
import {mapState} from 'vuex';
import {swapHelper} from '@/store/swap.module';

export default {
    name: 'ApproveCondiction',
    props: {
        symbol: null,
        amount: 0,
        // status: {
        //     type: Boolean,
        //     default: false,
        // },
    },
    data() {
        return {
            notApproved: false,
            approving: false,
            // allowanceIsGreatZero: false,
        };
    },
    computed: {
        ...mapState(['isConnect']),
        ...swapHelper.mapState(['ver']),

        token() {
            return this.getSymbol(this.symbol);
        },
    },
    watch: {},
    methods: {
        getSymbol(symbols) {
            if (Array.isArray(symbols)) {
                return symbols.length > 0 ? symbols[0] : null;
            }
            return symbols;
        },
        approve(symbol) {
            if (!this.approving && symbol) {
                this.approving = true;
                this.$swap.approveToken(
                    {
                        amount: symbol.totalSupply,
                        token: symbol,
                        spender: this.ver == '2beta' ? this.$swap.$provider.getDelegateBetaAddress() :
                            this.ver === 2 ? this.$swap.$provider.getDelegateAddress() : this.$swap.$provider.getPlatformAddress()
                    },
                    (code, res) => {
                        if (code !== 0) {
                            this.approving = false;
                        }

                        if (code === 1) {
                            this.$notify({
                                title: 'Approve',
                                message: 'Approve Success',
                                type: 'success'
                            });
                            this.notApproved = false;
                            this.$emit('success');
                        }
                        if (code === 2) {
                            this.$notify({
                                title: 'Approve',
                                message: 'Approve Error',
                                type: 'error'
                            });
                        }
                    }
                );
            }
        },
    },
    mounted() {
        // console.log(this);
    },
};
</script>

<style scoped></style>

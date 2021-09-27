<template>
    <el-row class="input-item" :gutter="10">
        <el-col class="label">
            <el-row class="_row-flex">
                <el-col :span="12">{{ label }}</el-col>
                <el-col :span="11">
                    <slot name="append"/>
                </el-col>
            </el-row>
        </el-col>
        <el-col class="input">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div class="select" v-on="$listeners">
                    <template v-if="token">
                        <img :src="token && $icon(token)" alt=""/>
                        <span class="coin-name">{{ token | pick('symbol') }}</span>
                        <span class="coin-balance">
                    {{token | pick('balance') | toFixed($swap.fixed)}}</span>
                    </template>
                    <div class="coin-name" v-else>{{ $t('swapControl.chooseTokenText') }}</div>
                    <a-icon class="icon-arrow-down" type="icon-arrow-down"/>
                </div>
                <el-input class="large-el-input" v-model="val" @input.native="$filterNumber">
                    <a-max v-if="max" slot="suffix" @click.stop="$emit('max')"/>
                    <CalcBNB v-if="BNB" slot="suffix" :BNBNumber="BNBNumber"></CalcBNB>
                </el-input>
            </div>
        </el-col>
    </el-row>
</template>
<script>
    import CalcBNB from '../../../components/Calc-BNB';

    export default {
        name: 'InputItem',
        components: {
            CalcBNB
        },
        model: {
            prop: 'value',
            event: 'change',
        },
        props: {
            value: '',
            label: '',
            token: null,
            defaultValue: '',
            max: false,
            BNB: false,
            BNBNumber: '',
        },
        watch: {
            token: {
                handler(val) {
                    // console.log('token::', val);
                },
                immediate: true
            }
        },
        methods: {

        },
        computed: {
            val: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('change', val);
                },
            },
        },
    };
</script>
<style lang="less" scoped>
    .input-item {
        margin-bottom: 30px;

        .label {
            color: var(--col-label);
            // font-weight: 700;
            font-size: 16px;
            margin-bottom: 20px;
        }

        .select {
            width: 360px;
        }

        .large-el-input {
            width: 260px;
        }

        .select {
            border-radius: 12px;
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            cursor: pointer;
            color: var(--col-main-active);
            background-color: #292D31;
            position: relative;
            font-size: 18px;

            img {
                width: 30px;
                height: 30px;
            }

            span {
                margin-left: 10px;
            }

            .coin-name {
                color: var(--col-main);
            }

            .coin-balance {
                color: var(--col-label60);
            }

            .icon-arrow-down {
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
            }
        }
    }

    @media (max-width: 768px) {
        .input-item {
            .select {
                width: 280px;
            }

            ._row-flex {
                display: flex;
            }

            .large-el-input {
                width: 200px;
            }

            .el-col-12 {
                width: 250px;
            }
        }
    }
</style>

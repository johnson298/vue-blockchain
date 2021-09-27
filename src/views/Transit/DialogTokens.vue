<template>
    <el-dialog class="dialog-madel" :visible="open" @close="close">
        <header class="dialog-title">
            <template v-if="$slots.header">
                <slot name="header"></slot>
            </template>
            <template v-else>
                {{ title }}
            </template>
        </header>
        <main>
            <template v-if="showSearch">
                <el-form :model="form" ref="ruleForm" @submit.native.prevent>
                    <el-form-item prop="amount">
                        <el-input
                            class=""
                            :placeholder="$t('coinSelectView.Search')"
                            v-model.lazy="query"
                            autocomplete="off"
                            @input="filterList"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="bCenter">
                    <el-button
                        round
                        size="small"
                        type="warning"
                        @click="sortClick('symbol')"
                    >
                  <span class="vCenter">
                    {{ $t('coinSelectView.coin_title') }}
                    <a-icon class="arrow" type="icon-arrow-down"/>
                  </span>
                    </el-button>
                    <el-button
                        round
                        size="small"
                        type="warning"
                        @click="sortClick('balance')"
                    >
                        <a-icon type="icon-sort"/>
                    </el-button>
                </div>
            </template>

            <a-loading :loading="load && ETH">
                <ul class="BToken-list">
                    <li
                        v-for="(item,index) in showList"
                        :key="item.address"
                        @click="triggerClose(item)"
                    >
                        <div class="token-name">
                            <img class="tokenIcon" :src="$icon(item)" alt=""/>
                            <span>{{ item.symbol }}</span>
                        </div>
                        <span class="token-balance">
                    <!--            {{ item.balance | toFixed($swap.fixed) }}-->
                        </span>
                        <i class="el-icon-loading" v-if="item.address === selectAddress"></i>
                    </li>
                </ul>
            </a-loading>
        </main>
        <footer v-if="$slots.footer" class="dialog-footer">
            <slot name="footer"></slot>
        </footer>
    </el-dialog>
</template>

<script>

    import {ETHConfig} from '@/assets/js/tokenMap';

    function upperCase(val) {
        return val ? val.toUpperCase() : val;
    }

    export default {
        name: 'DialogTokens',
        model: {
            prop: 'value',
            event: 'change',
        },
        props: {
            value: '',
            showSearch: {
                type: Boolean,
                default: true,
            },
            title: {
                type: String,
                default: '',
            },
            tokensList: {
                type: Array,
                default: () => [],
            },
            append: {
                type: String,
                default: '',
            },
            open: {
                type: Boolean,
                default: true,
            },
            ETH: {
                type: Boolean,
                default: true,
            },
            spender: {
                type: String,
                default: '',
            }
        },
        computed: {
            query: {
                get() {
                    return this.form.query;
                },
                set(val) {
                    this.form.query = val;
                    this.$emit('change', val);
                },
            },
        },
        watch: {
            tokensList: {
                handler(val) {
                    if(val.length > 0){
                        this.filterList()
                        this.load = false
                    }
                },
                immediate: true,
            },
            open: {
                handler(val) {
                    if (val) {
                        this.query = '';
                        this.selectAddress = '';
                        this.filterList();
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                form: {
                    query: '',
                },
                sortBy: {
                    type: 'idx',
                    sort: -1,
                },
                showList: [],
                load: true,
                selectAddress: '',
            };
        },
        methods: {
            sortClick(type) {
                if (this.sortBy.type !== type) {
                    this.sortBy = {type, sort: -1};
                } else if (this.sortBy.type === type && this.sortBy.sort === -1) {
                    this.sortBy.sort *= -1;
                } else {
                    this.sortBy = {
                        type: 'idx',
                        sort: -1,
                    };
                }
                this.filterList();
            },

            filterList() {
                const list = this.tokensList.filter((d) => {
                    const condiction =
                        upperCase(d.symbol).indexOf(upperCase(this.query)) > -1 ||
                        upperCase(d.address) === upperCase(this.query);
                    return condiction;
                });

                // console.log('this.tokensList========', this.tokensList)
                this.showList = this.sortList(list);
                if (this.showList.length === 0 && this.query) {
                    this.load = true
                    this.$swap.$query.queryNewToken(this.query).then(res => {
                        console.log('res::======>', res,'==', this.query,'--', this.tokensList);
                        this.load = false
                        if (res.valid) {
                            res.decimals = res.decimal;
                            this.showList = [res];
                        }
                    });
                }
            },
            sortList(list) {
                const aa = Array.from(list);
                return aa.sort((a, b) => {
                    const {type, sort} = this.sortBy;
                    return type === 'idx'
                        ? a.idx - b.idx
                        : a[type] && b[type]
                            ? a[type].localeCompare(b[type]) * sort
                            : 0;
                });
            },


            triggerClose(d) {
                console.log('triggerClose', d)
                this.query = '';

                // if(d.allowance>0 && d.address !== ETHConfig.address) {
                //     this.$emit('update:open', false);
                //     this.$emit('close',d);
                //     return;
                // }

                this.selectAddress = d.address;
                if (d.address === ETHConfig.address) {
                    this.$swap.$provider.getBalance().then(balance => {
                        this.selectAddress = '';
                        this.$emit('update:open', false);
                        this.$emit('close', {...d, balance: balance});
                    });
                } else {
                    // console.log('spender', this.spender);
                    this.$swap.getTokenInfo({
                        token: d.address,
                        spender: this.spender
                    }).then(res => {
                        console.log(res,'close res');
                        this.selectAddress = '';
                        this.$emit('update:open', false);
                        this.$emit('close', {...d, ...res});
                    });
                }
            },
            close() {
                this.load = false
                this.$emit('update:open', false);
            },
        },
    };
</script>

<style lang="less" scoped>
    .dialog-title {
        font-size: 24px;
        font-weight: 700;
        color: #1e2226;
    }

    .bCenter {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .vCenter {
        display: flex;
        align-items: center;
    }

    .arrow {
        font-size: 16px;
        margin-left: 10px;
    }

    .BToken-list {
        width: 100%;
        margin-top: 20px;
        overflow: auto;
        max-height: 50vh;
        font-size: 18px;
        color: #000;

        li {
            cursor: pointer;
            &:hover {
                background-color: rgba(#000, 0.1);
            }

            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;

            .token-name {
                font-weight: bold;
                display: flex;
                align-items: center;
            }
            .el-icon-loading{
                margin-right: 10px;
                font-size: 24px;
                color: #E6A23C;
                font-weight: 800;
            }
        }
    }

    .tokenIcon {
        width: 30px;
        margin-right: 15px;
    }
</style>

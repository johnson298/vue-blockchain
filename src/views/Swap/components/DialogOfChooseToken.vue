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
            <el-form :model="form" ref="ruleForm" @submit.native.prevent>
                <el-form-item prop="amount">
                    <el-input
                        class=""
                        :placeholder="$t('coinSelectView.Search')"
                        v-model.lazy="query"
                        @input="queryChange"
                        @keyup.enter.native="queryChange"
                        autocomplete="off"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="bCenter">
                <el-button
                    round
                    size="small"
                    type="warning"
                    class="waring-button"
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
                    class="icon-sort-btn"
                    @click="sortClick('balance')"
                >
                    <a-icon class="icon-sort" type="icon-sort"/>
                </el-button>
            </div>
            <a-loading :loading="load">
                <ul class="BToken-list">
                    <li
                        v-for="(item,index) in showList"
                        :key="index"
                        @click="triggerClose(item)"
                    >
                        <div class="token-name">
                            <img class="tokenIcon" :src="$icon(item.address)" alt=""/>
                            <span>{{ item.symbol }}</span>
                        </div>

                        <i class="token-balance el-icon-loading" v-if="item.isDefaultData"></i>
                        <span class="token-balance" v-else> {{ item.balance | toFixed($swap.fixed) }} {{ item.symbol }}</span>
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
    import {swapHelper} from '@/store/swap.module';
    import { mapState } from 'vuex';
    import {AddList} from "@/assets/js/tokenMap.js";

    function upperCase(val) {
        return val ? val.toUpperCase() : val;
    }

    export default {
        name: 'DialogOfChooseToken',
        model: {
            prop: 'value',
            event: 'change',
        },
        props: {
            value: '',
            title: {
                type: String,
                default: '',
            },
            append: {
                type: String,
                default: '',
            },
            open: {
                type: Boolean,
                default: false,
            },
            excludes: {
                type: Array,
                default: function () {
                    return [];
                },
            },
            fromOrigin: false,
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
            ...swapHelper.mapState(['tokenList']),
            ...swapHelper.mapGetters(['tokenMap', 'ver']),
            ...mapState(['chainId']),
        },
        watch: {
            // value: {
            //   handler(val) {
            //     if (val !== this.form.query) {
            //       this.form.query = val;
            //     }
            //   },
            //   immediate: true,
            // },
            tokenList: {
                handler(val) {
                    if(val.length > 0 && !val[0].isDefaultData) this.filterList();
                    else this.showList = val
                },
                immediate: true,
            },
            open: {
                handler(val) {
                    // console.log('open', val);
                    if (val) {
                        this.query = '';
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
                submitLoading: false,
                showList: [],
                load: false
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
                this.filterList(true);
            },
            triggerClose(d) {
                if(!d.isDefaultData){
                    this.query = '';
                    this.$emit('update:open', false);
                    this.$emit('close', d);
                }
            },
            queryChange() {
                this.filterList();
            },

            close() {
                this.$emit('update:open', false);
                this.load = false;
            },

            filterList(isSort = false) {
                const filterExcludes = (d) => {
                    return !this.excludes.some((dd) => {
                        return dd.address === d.address;
                    });
                };
                const arr = this.query
                    ? this.tokenList.filter((d) => {
                        const condiction =
                            upperCase(d.symbol).indexOf(upperCase(this.query)) > -1 ||
                            upperCase(d.address) === upperCase(this.query);

                        return condiction && filterExcludes(d);
                    })
                    : this.tokenList.filter(filterExcludes);

                this.showList = isSort ? this.sortList(arr) : arr;
                if(!isSort){
                    const adds = AddList[parseInt(this.chainId)] || [];
                    let _topSymbolToken = adds.filter(item => ['BURGER', 'BNB'].includes(item.symbol)).map(item => item.address)
                    const _defalutTokenList = this.showList.filter(item => !_topSymbolToken.includes(item.address))
                    const _defalutTopTokenLists = this.showList.filter(item => _topSymbolToken.includes(item.address))
                    this.showList = [..._defalutTopTokenLists,..._defalutTokenList]
                }

                console.log("this.$swap.queryNewToken: ", this.query)
                console.log("this.$swap.queryNewToken: ", this.ver)

                if (this.showList.length === 0) {
                    this.load = true;
                    this.$swap.queryNewToken(this.query, this.ver).then(res => {
                        console.log("this.$swap.queryNewToken res.valid: ", res.valid)
                        if (res.valid) {
                            res.decimals = res.decimal;
                            this.showList = [res];
                        }
                    }).finally(res => this.load = false);
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
        margin-top: -5px;
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

    .icon-sort {
        font-size: 20px;
        justify-content: center;
    }
</style>

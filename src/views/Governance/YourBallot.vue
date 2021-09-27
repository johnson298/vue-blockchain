<template>
<a-loading :loading="listLoading">
    <div class="your-ballot __container">
        <Vote
            :voteList="voteList"
            @search="search($event)"
            @upDataInit="getVoteList"
        ></Vote>
        <ul class="list">
            <template v-if="list.length > 0">
            <li
                v-for="(data, index) in list"
                :key="index"
                @click="showClick(data)"
            >
                <div class="left">
                    <img :src="iconMap[data.status] || iconMap.error" alt=""/>
                </div>
                <div class="center">
                    <div class="vote">{{ data.subject }}</div>
                    <div class="hash">{{ data.content}}</div>
                    <div class="time">
                        {{ (data.createTime * 1000) | moment('YYYY/MM/DD HH:mm:ss') }}
                    </div>
                </div>
                <div
                    class="right"
                    :class="[
              data.status === 'success'
                ? 'success'
                : data.status === 'pending'
                ? 'pending'
                : '',
            ]"
                >
                    {{
                    data.status === 'pending' && !item.voted
                    ? $t('VoteBooleanDetail.Your')
                    : data.status === 'pending' &&
                    item.voted &&
                    item.voteIndex === '1'
                    ? $t('VoteBooleanDetail.affirmative')
                    : data.status === 'pending' &&
                    data.voted &&
                    data.voteIndex === '2'
                    ? $t('VoteBooleanDetail.dissenting')
                    : (data.status === 'error' && data.voted && !data.minted) ||
                    (data.status === 'success' && data.voted && !data.minted)
                    ? $t('VoteBooleanDetail.Collect')
                    : (data.status === 'error' && data.voted && data.minted) ||
                    (data.status === 'success' && data.voted && data.minted)
                    ? $t('VoteBooleanDetail.Collected')
                    : data.status === 'success' && data.audited
                    ? $t('VoteBooleanDetail.Executed')
                    : data.status === 'success' && !data.audited
                    ? $t('VoteBooleanDetail.Execute')
                    : ''
                    }}
                    <svg class="icon-right" fill="currentColor" width="1em" height="1em">
                        <use xlink:href="#icon-back"></use>
                    </svg>
                </div>
            </li>
            </template>
            <li class="no-data" v-else>{{ $t('Public.NotData') }}</li>
        </ul>
        <el-dialog class="dialog-madel" :visible.sync="visible">
            <div class="dialog-title">
                <div class="type subject">
                    {{ item.subject }}
                </div>
            </div>
            <div class="dialog-body">
                <div class="block">
                    <img :src="iconMap[item.status] || iconMap.error" alt=""/>
                    {{
                    $t(
                    item.status === 'pending'
                    ? 'Government.Pending'
                    : item.status === 'success'
                    ? 'Government.Success'
                    : item.status === 'error'
                    ? 'Government.Error'
                    : '--'
                    )
                    }}
                </div>
                <div class="creater">
                    <span>{{ $t('VoteBooleanDetail.TotalBallotTitle') }}</span>
                    <span class="address"
                    >{{ item.total | toFixed(2) | toFormat }} {{ $project }}</span
                    >
                </div>
                <div class="creater">
                    <span>{{ $t('VoteBooleanDetail.Vote') }}</span>
                    <span class="address"
                    >{{ item.totalReward | toFixed(2) | toFormat }} {{ $project }}</span
                    >
                </div>
                <div class="total">
                    <div class="number" v-if="item.end && !item.minted && item.voted">
                        <p>
                            <span>{{ $t('VoteBooleanDetail.BonusText') }}:</span>
                            <span>&nbsp;{{ youVote || '--' }}</span>
                        </p>
                    </div>
                    <div class="collect" v-if="item.end && !item.minted && item.voted">
                        <el-button
                            @click="claimProposal(item)"
                            type="text"
                            :loading="claimLoading"
                            :disabled="item.minted"
                            class="button"
                            size="small"
                            round
                        >
                            {{ $t('Government.Collect') }}
                        </el-button>
                    </div>
                </div>
                <div class="creater">
          <span class="with5">{{
                  $t('VoteBooleanDetail.proposaleraddressTitle')
              }}</span>
                    <span class="with5">
            <a
                :href="$swap.getBscscanTrade(item.proposer)"
                target="_blank"
            >
              {{ item.proposer | hash }}
            </a>
          </span>
                </div>
                <div class="creater">
                    <span class="with5">{{ $t('VoteBooleanDetail.Creat') }}</span>
                    <span class="with5">{{
                                (item.createTime * 1000) | moment('YYYY-MM-DD HH:mm:ss')
                            }}</span>
                </div>
                <div class="creater">
                    <span class="with5">{{ $t('VoteBooleanDetail.finishedtitle') }}</span>
                    <span class="with5"
                    >{{ item.remainBlock || '0' }}{{ $t('VoteBooleanDetail.blocksleft') }}</span>
                </div>
                <div class="vote">
                    <div
                        class="support"
                        :class="{pointer: !(item.end || item.voted || stakeAmount <= 0)}"
                        @click="voteProposal(item, 1)"
                        v-loading="loadingYes"
                    >
                        <a-icon type="yes" :style="flex" style="font-size: 33px"></a-icon>
                        <div class="number-of-votes">
                            {{ item.YES | toFixed(2) | toFormat }}
                        </div>
                    </div>
                    <div
                        class="support-it"
                        :class="{pointer: !(item.end || item.voted || stakeAmount <= 0)}"
                        @click="voteProposal(item, 0)"
                        v-loading="loadingNo"
                    >
                        <a-icon type="no" :style="flex" style="font-size: 33px"></a-icon>
                        <div class="number-of-votes">
                            {{ item.NO | toFixed(2) | toFormat }}
                        </div>
                    </div>
                </div>
                <div class="effection">
                    <span>{{ $t('VoteBooleanDetail.ValuechangeTitle') }}</span>
                    <span>
            {{ unit === '%' ? item.currentValue * 100 : item.currentValue }}
            {{ unit }}
            &nbsp;->&nbsp;
            {{ unit === '%' ? item.value * 100 : item.value }} {{ unit }}
          </span>
                </div>
                <div class="your-vote-box" v-if="item.weight > 0">
                      <span class="my-vote">
                        {{ $t('Government.YouVote') }}
                      </span>
                    <span>{{ item.weight | toFixed(4) | toFormat }}</span>
                </div>
                <div class="output">
                    {{ item.content || '--' }}
                </div>
            </div>
            <div class="dialog-footer">
                <el-button
                    :disabled="
            item.end ||
            item.status === 'error' ||
            (item.status === 'success' && item.audited) ||
            item.remainBlock > 0
          "
                    @click="determine(item)"
                    :loading="loading"
                    class="__button swap implement-btn"
                >
                    {{ $t('Button.Implement') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</a-loading>

</template>

<script>
import Vote from './Vote';
import {combineLatest} from 'rxjs';

export default {
    components: {
        Vote,
    },
    props: ['totalStake'],
    name: 'YourBallot',
    data() {
        return {
            flex: {
                'justify-content': 'center',
                display: 'flex',
                width: '40px',
                height: '36px',
                'align-items': 'center',
            },
            loading: false,
            visible: false,
            item: {
                NO: '',
                YES: '',
                address: '',
                audited: false,
                content: '',
                createTime: '',
                currentValue: '',
                end: false,
                error: null,
                key: '',
                minted: false,
                pending: null,
                proposer: '',
                remainBlock: 0,
                subject: '',
                success: '',
                token: '',
                totalReward: '',
                type: '',
                value: '',
                voteIndex: '',
                voted: false,
                weight: '0',
                total: '',
            },
            loadingYes: false,
            loadingNo: false,
            claimLoading: false,
            data: [],
            list: [],

            listLoading: false,
            voteList: [],
            newData: [],
            youVote: '',
            unit: '',
            $sub: null,
            isLogin: false,

            searchFilter: null,
            iconMap: {
                pending: require('../../assets/images/pending.svg'),
                success: require('../../assets/images/success.svg'),
                error: require('../../assets/images/error.svg'),
            },
            stakeAmount: '',
        };
    },
    watch: {
        totalStake: {
            handler(val) {
                this.stakeAmount = val.stakeAmount;
            },
            immediate: true,
        },
    },
    computed: {},
    mounted() {
        this.init();
    },
    destroyed() {
        this.$sub && this.$sub.unsubscribe();
    },
    methods: {
        init() {
            this.$sub = this.comb();
        },
        comb() {
            return combineLatest([
                this.$swap.loginStatus() && this.$swap.chainId(),
            ]).subscribe(([isLogin, chainId]) => {
                this.isLogin = isLogin;
                if (isLogin) {
                    this.getVoteList();
                }
            });
        },
        getVoteList() {
            this.listLoading = true;
            this.$store.dispatch('governance/getVoteList').then((data) => {
                this.data = data.map((d) => {
                    d.audited =
                        d.end &&
                        Number(d.YES) > Number(d.NO) &&
                        Number(d.createTime) * 1000 < 1600704000000
                            ? true
                            : d.audited;
                    d.status = !d.end
                        ? 'pending'
                        : d.end && Number(d.YES) > Number(d.NO)
                            ? 'success'
                            : d.end && Number(d.YES) < Number(d.NO)
                                ? 'error'
                                : 'error';
                    return d;
                });
                this.voteList = SwapInstance.$constant.BallotList.map((k, index) => {
                    for (let i of data) {
                        if (k.key === i.key && !i.end) {
                            k.disabled = true;
                        }
                    }
                    return k;
                });
                this.listLoading = false;
                this.filterList();
            });
        },
        filterList() {
            this.list = this.data
                .filter((d) => {
                    return this.searchFilter === null
                        ? d
                        : d.status === this.searchFilter;
                })
                .sort((a, b) => {
                    return Number(b.createTime) - Number(a.createTime);
                });
            this.$store.commit('governance/setVoteList', this.list);
        },
        determine(item) {
            if (!this.isLogin) {
                return;
            }
            this.loading = true;
            this.$store.dispatch('governance/implement', {
                address: item.address,
                cb: (proposal, tx) => {
                    if (proposal === 2 || proposal === 3) {
                        this.loading = false;
                    }
                    if (proposal === 1) {
                        this.visible = false;
                        this.loading = false;
                        this.msg();
                        this.getVoteList();
                        this.$store.dispatch('recordCallback', {
                            key: 'Proposal',
                            action: 'governance',
                            params: {describe: 'Execute proposal'},
                            code: proposal,
                            result: tx,
                        });
                    }
                },
            });
        },
        voteProposal(item, index) {
            console.log(item);
            let voteFlag = false;
            if (item.end || item.voted) {
                voteFlag = true;
            }
            if (
                voteFlag ||
                this.loadingYes ||
                this.loadingNo ||
                this.stakeAmount <= 0
            ) {
                return;
            }
            if (index === 0) {
                this.loadingYes = true;
            } else {
                this.loadingNo = true;
            }
            this.$store.dispatch('governance/voteClick', {
                address: item.address,
                num: index,
                cb: (vote, tx) => {
                    if (vote === 2 || vote === 3) {
                        this.loadingYes = false;
                        this.loadingNo = false;
                    }
                    if (vote === 1) {
                        this.visible = false;
                        this.msg();
                        this.getVoteList();
                        this.loadingYes = false;
                        this.loadingNo = false;
                        this.$store.dispatch('recordCallback', {
                            key: 'vote',
                            action: 'governance',
                            params: {describe: 'Vote'},
                            code: vote,
                            result: tx,
                        });
                    }
                },
            });
        },
        claimProposal(item) {
            this.claimLoading = true;
            if (item.address) {
                this.$store.dispatch('governance/reward', {
                    address: item.address,
                    cb: (collect, tx) => {
                        if (collect === 1) {
                            this.init();
                            this.visible = false;
                            this.msg();
                            this.claimLoading = false;
                            this.$store.dispatch('recordCallback', {
                                key: 'Collect',
                                action: 'governance',
                                params: 'Collect vote bonus',
                                code: collect,
                                result: tx,
                            });
                        }
                    },
                });
            }
        },
        msg() {
            this.$message({
                message: this.$t('Public.OperationSuccess'),
                showClose: true,
                type: 'success',
            });
        },
        showClick(data) {
            if (!this.isLogin) {
                return;
            }
            if (data.address) {
                this.$store
                    .dispatch('governance/youVote', {
                        address: data.address,
                    })
                    .then((you) => {
                        this.youVote = you;
                    });
            }
            if (data.key) {
                this.unit = this.$store
                    .dispatch('governance/getUnit', {key: data.key})
                    .then((res) => {
                        this.unit = res;
                    });
            }

            this.item = {...data};
            console.log('data::', this.item);
            this.item.total = this.$number(this.item.YES).plus(this.item.NO);
            this.visible = true;
            this.loadingYes = false;
            this.loadingNo = false;
        },
        search($event) {
            if (!this.isLogin) {
                return;
            }
            this.searchFilter = $event;
            this.filterList();
        },
    },
};
</script>

<style lang="less" scoped>
    .your-ballot {
        min-height: 300px;
        margin-top: 20px;

        background: transparent;

        .tips {
            font-size: 24px;
            color: #000;
        }

        .list {
            margin-bottom: 10px;
            max-height: 600px;

            li {
                cursor: pointer;
                height: 132px;
                background: rgba(255, 255, 255, 0.05);
                margin-top: 10px;
                display: flex;
                padding: 20px;
                font-size: 16px;
                position: relative;
                border-radius: 10px;

                .icon-right {
                    transform: rotate(180deg);
                }

                .time {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 14px;
                }

                .hash {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 16px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    max-width: 400px;
                }

                .vote {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 16px;
                }

                .left {
                    margin-right: 30px;
                }

                .center {
                    flex: 1;
                    justify-content: space-between;
                    flex-direction: column;
                    display: flex;
                }

                .right {
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    font-size: 14px;

                    &.pending {
                        color: var(--col-main);
                    }

                    &.success {
                        color: rgba(255, 255, 255, 0.5);
                    }

                    .icon-right {
                        margin-left: 10px;
                        color: #fff;
                        font-weight: bold;
                    }
                }

                &.no-data {
                    align-items: center;
                    justify-content: center;
                    color: var(--col-label60);
                    font-size: 16px;
                }
            }
        }
    }

    @media (max-width: 960px) {
        .your-ballot {
            padding: 0 20px;
            min-height: 300px;
            margin-top: 20px;

            .list {
                margin-bottom: 10px;
                max-height: 600px;
                overflow-y: auto;

                li {
                    height: 100px;
                    //background: rgba(255, 255, 255, 0.05);
                    margin-top: 10px;
                    display: flex;
                    padding: 20px;

                    .left {
                        margin-right: 30px;
                    }

                    .right {
                        font-size: 20px;
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }
    }
</style>

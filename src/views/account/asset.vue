<template>
<div class="card-item">
    <div :class="['asset-page', type]">
        <div class="asset">
            <slot v-if="$slots.title" name="title"/>
            <template v-else>
            <img :src="$icon(token)" alt=""/>
            {{ token }} {{ $t(data[type]) }}
            </template>
        </div>
        <div class="total" :style="{ color: color }">
            {{ $t('Account.Total') }}{{ total | toFixed(2) | toFormat }}&nbsp;{{'USDT'}}
        </div>
    </div>
    <div class="content">
        <slot/>
    </div>
</div>
</template>

<script>
export default {
    props: {
        color: '',
        token: {
            type: String,
            default: '',
        },
        type: '',
        total: '',
    },
    name: 'asset',
    data() {
        return {
            data: {
                deposit: 'Account.DepositText',
                loan: 'FundPool.Loan',
                pledge: 'Account.Pledge',
            },
        };
    },
    methods: {},
};
</script>

<style lang="less" scoped>
    .card-item {
        margin-bottom: 40px;

        .content {
            padding: 0 20px;
        }
    }

    .asset-page {
        padding: 0 20px;
        height: 75px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        &::before {
            position: absolute;
            content: "";
            height: 50%;
            width: 4px;
            left: 0;
            top: 25%;
        }

        &.deposit::before {
            background-color: var(--col-deposit);
        }

        &.loan::before {
            background-color: var(--col-borrow);
        }

        .asset {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 600;
            color: var(--col-label);

            img {
                height: 28px;
                margin-right: 5px;
            }
        }

        .total {
            font-size: 16px;
            color: var(--col-font);
        }
    }

    .content {
        padding: 0 30px;
    }

    @media (max-width: 960px) {
        .asset-page {
            padding: 0 30px;
            align-items: center;

            .asset {
                font-size: 30px;
            }

            .total {
                font-size: 24px;
            }
        }
    }
</style>

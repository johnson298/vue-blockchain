<template>
    <div :class="['lp-name', { space: space }, {'select': select}]">
        <template v-if="pool">
            <template v-if="pool.lpToken0Symbol && pool.lpToken1Symbol">
                <img :src="$icon(pool.lpToken0Symbol)" alt=""/>
                <img :src="$icon(pool.lpToken1Symbol)" alt=""/>
            </template>
            <template v-else>
                <span class="station"></span>
                <img :src="$icon(pool.collateralTokenSymbol)" alt=""/>
            </template>
            <span :class="['info', { hide: imgHide }]">
        {{ pool.collateralTokenSymbol }}&nbsp;
        <span v-if="pool.lpToken0Symbol && pool.lpToken1Symbol"
        >{{ pool.lpToken0Symbol }}-{{ pool.lpToken1Symbol }}</span
        >
      </span>
        </template>
        <span v-else>-- --</span>
    </div>
</template>

<script>
export default {
    name: 'LPSymbol',
    props: {
        pool: {
            type: [Object, null],
            default: null,
        },
        select: {
            type: Boolean,
            default: false,
        },
        space: {
            type: Boolean,
            default: false,
        },
        imgHide: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
    },
};
</script>

<style lang="less" scoped>
.lp-name {
    display: flex;
    align-items: center;
    line-height: 1;
    white-space: nowrap;
    font-weight: 600;

    img,
    .station {
        width: 30px;
        height: 30px;
    }

    &.select{
        .info {
            color: #000;
        }
    }
    .info {
        margin-left: 10px;
        color: var(--col-main-active);

        &.hide {
            display: block;
        }
    }

    &.space {
        margin-bottom: 10px;
    }
}

@media (max-width: 960px) {
    .lp-name {
        img,
        .station {
            width: 32px;
            height: 32px;
        }

        .info {
            &.hide {
                display: none;
            }
        }
    }
}
</style>

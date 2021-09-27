<template>
<div>
    <template v-if="loading">
    <div class="loading">
        <div class="loading-box">
            <img src="../../assets/images/logo/logo.png" alt="">
        </div>
        <span>Loading...</span>
    </div>
    </template>
    <slot v-else></slot>
</div>
</template>

<script>
export default {
    name: 'loading',
    props: ['loading'],
    data() {
        return {};
    }
};
</script>

<style lang="less" scoped>
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .loading {
        width: 100%;
        padding: 30px 0 0;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .loading-box {
            display: flex;

            img {
                display: block;
                margin: auto;
                animation: spin 2s linear infinite;
            }
        }

        span {
            text-align: center;
            padding-top: 20px;
            font-size: 14px;
            color: var(--col-main);
        }
    }
</style>

<template>
<div class="_ifo-progress">
    <p v-html="isOpen ? $t('Ifo.openTime',{d: time.d, h: time.h, m: time.m, s: time.s}) :
        $t('Ifo.comingTitle', {d: time.d, h: time.h, m: time.m, s: time.s})">
    </p>
    <el-progress :percentage="percentage" :color="customColor" :stroke-width="10"
        :show-text="false"></el-progress>
</div>
</template>

<script>
export default {
    name: 'ifo-progress',
    props: ['percentage', 'time', 'isOpen'],
    data() {
        return {
            customColor: '#F0B80B'
        }
    },
    watch: {
        time: {
            handler(val) {

            },
            immediate: true
        }
    }
}
</script>

<style scoped lang="less">
    @keyframes bg {
        0% {
            width: 0;
        }
        100% {
            width: 100%;
        }
    }
    ._ifo-progress {
        width: 100%;
        color: #ffffff;

        p {
            font-size: 14px;
            margin-bottom: 15px;

            span {
                color: #F0B80B;
            }
        }

        .el-progress {
            display: flex;
            align-items: center;
        }


        /deep/ .el-progress-bar__outer {
            background-color: #1F2226;
        }

        /deep/ .el-progress-bar__inner {
            &::before {
                position: absolute;
                top: 0;
                left: 0;
                content: '';
                width: 100%;
                height: 100%;
                border-radius: 10px;
                background-color: rgba(#ffffff, .2);
                animation: 3.5s linear 0s infinite normal none running bg;
            }
        }
    }
</style>

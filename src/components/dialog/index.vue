<template>
    <el-dialog class="dialog-madel" :visible="show" @close="show = false">
        <div class="img">
            <img v-if="type === 'warn'" src="~img/warn.png" alt="" style="z-index: 3"/>
        </div>
        <div class="title" v-html="title">
        </div>
        <div class="footer" v-html="tip">
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'Dialog',
        data(){
            return {
                show: false,
                title: '',
                tip: '',
                type: 'warn'
            }
        }
    };
</script>

<style lang="less" scoped>
    .img {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0 62px;
        img {
            width: 80px;
        }
    }

    .iconArrow {
        .direction {
            color: var(--col-main);
            font-size: 30px;
            padding: 0 20px;
        }
    }

    .title {
        font-size: 24px;
        color: #1E2226;
        font-weight: 700;
        text-align: center;
        word-wrap:break-word
    }

    .footer {
        font-size: 14px;
        color: #1E2226;
        text-align: center;
        margin: 10px 0 62px 0;
        line-height: 1.4;
        word-break:normal !important
    }
</style>

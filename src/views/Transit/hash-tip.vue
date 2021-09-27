<template>
<el-dialog
    :title="title"
    :visible="visible"
    :width="width"
    :close-on-click-modal="false"
    @close="cancel"
    custom-class="_hash-tip">
    <p v-if="code === 0">
        <span v-if="msg===0">{{$t('Transit.hashTipSuccess1')}}</span>
        <span v-if="msg ===1">{{$t('Transit.hashTipSuccess2')}}</span>
    </p>
    <p v-if="code ===1 || code ===2">
        {{$t('Transit.hashTipError')}}
    </p>
    <p v-if="code === 3">
        Invalid input data, please input Transaction Hash with '0x' prefix.
    </p>
</el-dialog>
</template>

<script>
export default {
    name: 'hash-tip',
    props: ['visible', 'code', 'msg'],
    data() {
        return {
            title: '',
            width: '530px'
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
    }
}
</script>

<style scoped lang="less">
    ::v-deep ._hash-tip {
        top: 50%;
        transform: translateY(-50%);
        margin-top: 0 !important;
        border-radius: 10px;

        .el-dialog__header {
            font-size: 18px;
            font-weight: bold;
            height: 0;
            padding: 0 24px;
            display: flex;
            align-items: center;
            position: relative;

            .el-dialog__headerbtn {
                top: 50%;
                transform: translateY(10px);

                .el-dialog__close {
                    font-size: 24px;
                    color: #212833;


                    &:hover {
                        color: var(--col-main);
                    }
                }
            }
        }

        .el-dialog__body {
            text-align: center;
            margin: 15px 0;
        }
    }
</style>

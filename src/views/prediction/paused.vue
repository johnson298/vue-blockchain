<template>
    <div class="_paused-modal" v-if="visible">
        <img src="../../assets/images/prediction/img3.svg" alt="" class="_top-img">
        <div>
            <p class="_paused-title">{{$t('prediction.pausedTxt1')}}</p>
            <p class="_paused-txt">{{$t('prediction.pausedTxt2')}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'paused',
    props: ['visible']
}
</script>

<style scoped lang="less">
    ._paused-modal {
        position: relative;
        width: 420px;
        z-index: 1;
        margin: 0 auto;
        padding-top: 200px;

        &>div {
            background-color: #ffffff;
            width: 100%;
            padding: 30px 28px;
            z-index: 2;
            border-radius: 10px;
        }

        ._top-img {
            width: 220px;
            position: absolute;
            top: 80px;
            left: 50%;
            z-index: -1;
            transform: translateX(-50%);
        }

        ._paused-title {
            font-weight: 600;
            font-size: 24px;
            line-height: 21px;
            color: #000000;
            margin-bottom: 40px;
        }

        ._paused-txt {
            font-weight: 500;
            font-size: 20px;
            line-height: 24px;
            color: #1F2226;
            margin-bottom: 45px;
            /*&:nth-last-of-type(1) {*/
            /*    margin-bottom: 0;*/
            /*}*/
        }
    }
    @media (max-width: 768px) {
        ._paused-modal {
            max-width: 100%;
        }
    }
</style>

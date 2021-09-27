<template>
<div class="_coming-soon">
    <img src="../assets/images/coming.svg" alt="">
    <div>
        <p>{{$t('Ifo.comTitle')}}</p>
<!--        <p>{{$t('Ifo.comSubTitle')}}</p>-->
    </div>
</div>
</template>

<script>
export default {
    name: 'ComingSoon'
}
</script>

<style scoped lang="less">
    ._coming-soon {
        max-width: 100%;
        width: 1004px;
        height: 405px;
        background: rgba(47, 50, 54, 0.5);
        border: 1px solid #44474B;
        border-radius: 45px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 336px;
        }

        &>div {
            text-align: center;
            margin-left: 56px;
            p {
                &:nth-of-type(1) {
                    font-size: 48px;
                    color: #f0b80b;
                    margin-bottom: 38px;
                }

                &:nth-of-type(2) {
                    font-size: 24px;
                    color: #A5A7A8;
                }
            }
        }
    }

    @media (max-width: 768px) {
        ._coming-soon {
            display: block;
            text-align: center;
            height: auto;
            padding: 70px 0 80px;
            img {
                margin-left: -40px;
            }

            &>div {
                margin-left: 0;
                margin-top: 58px;
                p {
                    &:nth-of-type(1) {
                        font-size: 28px;
                        margin-bottom: 28px;
                    }

                    &:nth-of-type(2) {
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>

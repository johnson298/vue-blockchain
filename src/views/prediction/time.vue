<template>
    <div class="_times">
        <p>
            <span class="_center">5m</span>
            <span class="_left">{{item.m}}:{{item.s}}</span>
        </p>
        <img src="../../assets/images/prediction/img2.svg" alt="">
    </div>
</template>

<script>
export default {
    name: 'time',
    props: ['item']
}
</script>

<style scoped lang="less">
    ._times {
        height: 53px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;

        p {
            margin-right: 10px;
            span {
                display: block;
                text-align: right;
            }
        }

        ._left {
            font-weight: 600;
            font-size: 18px;
            color: #F0B80B;
        }

        ._center {
            font-weight: 500;
            font-size: 14px;
            color: #C68100;
            margin-bottom: 4px;
        }
    }

    @media (max-width: 768px) {
        ._times {
            ._left {
                font-size: 16px;
            }

            img {
                width: 35px;
            }
        }
    }
</style>

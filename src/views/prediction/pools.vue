<template>
    <div class="_pools" @click="symbolClick">
        <img src="../../assets/images/prediction/menu.svg" alt="">
        <p>
            <span>{{name}}</span>
            <span>$<count-jump :val="$toFixed(currentPrice, 2)" is-format="true"/></span>
        </p>
    </div>
</template>

<script>
import CountJump from '../../components/countJump/index';

export default {
    name: 'pools',
    components: {CountJump},
    props: ['name', 'currentPrice'],
    methods: {
        symbolClick() {
            this.$emit('symbol')
        }
    }
}
</script>

<style scoped lang="less">
    ._pools {
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
            width: 44px;
        }

        p {
            margin-left: 13px;

            span {
                display: block;

                &:nth-of-type(1) {
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 18px;
                    color: #ffffff;
                    margin-bottom: 4px;
                }

                &:nth-of-type(2) {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 14px;
                    color: #C68100;
                }
            }
        }
    }

    @media (max-width: 768px) {
        ._pools {
            img {
                width: 30px;
            }
        }
    }
</style>

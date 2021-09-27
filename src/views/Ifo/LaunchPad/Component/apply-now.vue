<template>
<div class="_apply-now">
    <div>
        <p>Want to launch your own IFO with BurgerSwap?</p>
        <el-button class="_n-btn" @click="toLink">Apply Now</el-button>
    </div>
</div>
</template>

<script>
export default {
    name: 'apply-now',
    methods: {
        toLink() {
            window.open('https://forms.gle/q7zYNyY7HEHkeSxP9');
        }
    }
}
</script>

<style scoped lang="less">
    ._apply-now {
        width: 100%;
        text-align: center;
        padding: 0 40px;
        min-height: 200px;
        margin-top: 34px;

        & > div {
            width: 100%;
            height: 100%;
            background-image: url("../../../../assets/images/ifo/ifo-2.png");
            background-size: 100% 100%;
            background-position: center center;
            background-repeat: no-repeat;
        }

        p {
            font-weight: 500;
            font-size: 30px;
            line-height: 30px;
            color: #ffffff;
            margin: 48px 0 40px;
        }

        ._n-btn {
            width: 388px;
            background: linear-gradient(360deg, #F0B90B 0%, #F8D12F 100%);
            border-radius: 36px;
            color: #212833;
            margin-bottom: 30px;
        }
    }

    @media (max-width: 768px) {
        ._apply-now {
            margin-bottom: 40px;
            p {
                font-size: 20px;
            }

            ._n-btn {
                width: 300px;
            }
        }
    }
</style>

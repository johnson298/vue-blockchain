<template>
    <div class="_prev-next">
        <a-icon type="icon-arrow-down1" class="_prev-icon" @click="prevClick"/>
        <img src="../../assets/images/prediction/img1.png" alt="" @click="centerClick">
        <a-icon type="icon-arrow-down1" class="_next-icon" @click="nextClick"/>
    </div>
</template>

<script>
export default {
    name: 'prev-next',
    methods: {
        prevClick() {
            this.$emit('prev')
        },
        nextClick() {
            this.$emit('next')
        },
        centerClick() {
            this.$emit('center')
        }
    }
}
</script>

<style scoped lang="less">
    ._prev-next {
        display: flex;
        align-items: center;
        .a-icon {
            margin: 0 10px;
            cursor: pointer;
            ::v-deep svg {
                font-size: 30px;
                color: #EC7645;
            }
        }

        img {
            cursor: pointer;
            width: 72px;
        }

        ._prev-icon {
            transform: rotate(90deg);
        }

        ._next-icon {
            transform: rotate(-90deg);
            margin-left: 7px;
        }
    }

    @media (max-width: 768px) {
        ._prev-next {
            display: none;
        }
    }
</style>

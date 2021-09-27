<template>
<div class="_tabs">
    <template v-for="el of tabsList">
    <span :class="{'active': el.active === active}" @click="tabClick(el.name, el.active)">
        {{$t(el.label)}}
    </span>
    </template>
</div>
</template>

<script>
export default {
    name: 'Tabs',
    props: ['tabsList', 'active'],
    watch: {
        tabsList: {
            handler(val) {
                console.log('VAL....', val)
            }
        }
    },
    methods: {
        tabClick(name, active) {
            this.$emit('tab', {name, active})
        }
    }
}
</script>

<style scoped lang="less">
    ._tabs {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 64px;

        span {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            padding-bottom: 20px;
            margin-right: 60px;
            transition: all .2s;
            cursor: pointer;
            position: relative;

            &:nth-last-child(1) {
                margin-right: 0;
            }

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                width: 80%;
                height: 2px;
                background-color: transparent;
            }

            &:hover {
                color: #F0B80B;
            }
        }

        .active {
            color: #F0B80B;

            &::after {
                background-color: #F0B80B;
            }
        }
    }
</style>

<template>
<div class="tag">
    <span class="on-going" v-if="status === 1">{{$t('Ifo.onGoing')}}</span>
    <span class="end" v-if="status === 2">{{$t('Ifo.end')}}</span>
    <span class="soon" v-if="status === 0">{{$t('Ifo.comingSoon')}}</span>
</div>
</template>

<script>
export default {
    name: 'state-tag',
    props: ['status'],
    mounted() {
        this.init();
    },
    methods: {
        init() {
            console.log('status', this.status)
        }
    }
}
</script>

<style scoped lang="less">
    .tag {
        display: inline-flex;
    }

    .tag span {
        display: inline-flex;
        align-items: center;
        height: 30px;
        font-size: 16px;
        padding: 0 15px;
        border-radius: 4px;
        color: #ffffff;
    }

    .on-going {
        background: linear-gradient(90deg, #0FC4FD 0%, #25A1FA 100%);
        box-shadow: 0px 0px 10px rgba(25, 182, 252, 0.16);
    }

    .not-start {
        background: linear-gradient(90deg, #FD560F 0%, #FA3F25 100%);
        box-shadow: 0px 0px 10px rgba(253, 86, 15, 0.2);
    }

    .end {
        background: linear-gradient(90deg, #CAD0D9 0%, #BCC4CF 46.35%, #B2B8C0 100%);
        box-shadow: 0px 0px 10px rgba(229, 229, 229, 0.2);
        color: rgba(0, 0, 0, .3);
    }

    .soon {
        background-color: #FD560F;
    }
</style>

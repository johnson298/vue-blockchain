<template>
<div class="corner-marker">
    <div class="__cursor" @click="win('telegram')">
        <a-icon class="a-icon" type="telegram"></a-icon>
    </div>
    <div class="__cursor" @click="win('twitter')">
        <a-icon class="a-icon" type="twitter"></a-icon>
    </div>
    <div class="__cursor" @click="win('github')">
       <a-icon class="a-icon" type="github"></a-icon>
    </div>
    <div class="__cursor" @click="win('medium')">
       <a-icon class="a-icon" type="icon-medium"></a-icon>
    </div>
</div>
</template>

<script>
import {LINK} from '@/assets/js/link';

export default {
    name: 'Corner-marker',
    methods: {
        win(url) {
          window.open(LINK[url]);
        }
    }
};
</script>

<style lang="less" scoped>
    .corner-marker {
        display: flex;
        color: var(--col-part);

        .a-icon {
            font-size: 30px;
            cursor: pointer;
        }

        div:nth-child(n+1) {
            margin-right: 20px;
        }
    }
</style>

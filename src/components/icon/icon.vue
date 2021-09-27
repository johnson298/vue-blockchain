<template>
<span :class="['a-icon', { space: space }]" v-on="$listeners">
    <svg fill="currentColor" width="1em" height="1em">
      <use :xlink:href="xLinkHref"></use>
    </svg>
  </span>
</template>

<script>
export default {
    name: 'icon',
    props: {
        type: {
            type: String,
            default: '',
        },
        space: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        xLinkHref() {
            return `#${this.type}`;
        },
    },
};
</script>

<style lang="less" scoped>
    .a-icon {
        display: flex;

        &.space {
            margin-right: 10px;
        }
    }
</style>

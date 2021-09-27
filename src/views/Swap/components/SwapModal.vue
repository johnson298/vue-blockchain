<template>
    <el-dialog
        class="dialog-madel"
        :visible="open"
        :before-close="close"
        :close-on-click-modal="false"
    >
        <header class="dialog-title">
            <template v-if="$slots.header">
                <slot name="header"></slot>
            </template>
            <template v-else>
                {{ title }}
            </template>
        </header>
        <main>
            <div class="dialog-body">
                <slot></slot>
            </div>
        </main>
        <slot name="footer"/>
    </el-dialog>
</template>

<script>
export default {
    name: 'SwapModal',
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: '',
        title: {
            type: String,
            default: '',
        },
        open: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            submitLoading: false,
        };
    },
    methods: {
        close() {
            this.$emit('update:open', false);
        },
    },
};
</script>

<style scoped>
.dialog-title {
    color: #1e2226;
    font-weight: bold;
    font-size: 24px;
}
</style>

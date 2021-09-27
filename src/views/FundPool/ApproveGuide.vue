<template>
    <div>
        <el-button
            v-if="!allowanceIsGreatZero && !status"
            :loading="approving"
            :disabled="!isConnect"
            class="public-button-dark __button"
            @click="approve"
        >
            {{ $t('Button.Authorization') }}
        </el-button>
        <template v-else>
            <slot/>
        </template>
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: 'ApproveGuide',
    props: {
        symbol: null,
        type: String,
        silent: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            approving: false,
            allowanceIsGreatZero: false,
        };
    },
    computed: {
        ...mapState(['isConnect']),
    },
    watch: {
        symbol: {
            handler(val) {
                if (this.symbol && this.type && !this.silent) {
                    this.allowance();
                }
            },
            immediate: true,
        },
        allowanceIsGreatZero: {
            handler(val) {
                this.$emit('handle', val);
            },
            immediate: true,
        },
    },
    methods: {
        approve() {
            if (!this.approving && this.symbol) {
                this.approving = true;
                this.$store
                    .dispatch('approve', {
                        token: this.symbol[this.type],
                        pair: '',
                    })
                    .then((res) => {
                        this.allowanceIsGreatZero = true;
                    })
                    .finally(() => {
                        this.approving = false;
                    });
            }
        },
        allowance() {
            if (this.allowanceIsGreatZero) {
                this.allowanceIsGreatZero = false;
            }
            if (this.symbol) {
                this.$store
                    .dispatch('allowance', {
                        token: this.symbol[this.type],
                        pair: '',
                    })
                    .then((res) => {
                        this.allowanceIsGreatZero = this.$number(res).isGreaterThan(0);
                    });
            }
        },
    },
};
</script>

<style scoped></style>

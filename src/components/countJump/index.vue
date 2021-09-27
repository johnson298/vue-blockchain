<template>
    <i>{{$numFormat(value, isFormat)}}</i>
</template>

<script>
    import BigNumber from "bignumber.js";

    export default {
        name: "CountJump",
        props: {
            val: {
                default: 0
            },
            isFormat: {
                default: false
            }
        },
        data() {
            return {
                time: 1000,
                speed: 20,
                value: '--',
            }
        },
        watch: {
            val: {
                handler: function(val, old) {
                    if (isNaN(val)) return;
                    val = isNaN(val) ? 0 : val;
                    old = isNaN(old) ? 0 : old;
                    this.caleValue(val, old)
                },
                immediate: true,
                deep: true,
            },
        },
        methods: {
            caleValue(newVal, oldVal) {
                try {
                    const real = new BigNumber(newVal).minus(oldVal).toFixed();
                    if (real == 0) {
                        this.value = newVal;
                        return;
                    }
                    this.value = oldVal;
                    const _oldS = oldVal.toString().split('.');
                    const _newS = newVal.toString().split('.');
                    const _oldLength = _oldS.length > 1 ? _oldS[1].length : 0;
                    const _newLength = _newS.length > 1 ? _newS?.[1].length : 0;
                    const maxLength = Math.max(_newLength, _oldLength);
                    const accumulation = Math.floor(this.time / this.speed)
                    const step = this.$toFixed(new BigNumber(real).dividedBy(accumulation), maxLength);
                    let run = (count) => {
                        if (count > accumulation) {
                            this.value = newVal
                            return
                        }
                        ;

                        setTimeout(_ => {
                            const _count = new BigNumber(step).multipliedBy(count)
                            this.value = this.$toFixed(new BigNumber(oldVal).plus(_count), maxLength)
                            run(count + 1)
                        }, this.speed)
                    }
                    run(0)
                } catch (e) {
                    this.value = newVal
                }
            }
        }
    }
</script>

<style scoped>
    i {
        font-style: inherit;
        font-size: inherit;
    }
</style>

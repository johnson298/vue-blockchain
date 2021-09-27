<template>
    <div class="transition-dom"
         :style="{'height': currentHeight === 0 ? 'auto' : show ? currentHeight+'px' : '0px' }">
        <slot />
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "AprilTransition",
        data(){
            return {
                currentHeight: 0
            }
        },
        props: [ "show" ],
        computed: {
            ...mapGetters(['language']),
        },
        watch:{
            language(){
                this.getHeight();
            }
        },
        mounted() {
            this.getHeight();
        },
        methods: {
            getHeight() {
                this.currentHeight = 0;
                this.$nextTick(_=>{
                    this.currentHeight = this.$el.offsetHeight;
                })
            }
        },
    }
</script>

<style scoped>
    .transition-dom{
        overflow-y: hidden;
        transition: height .5s linear;
    }
</style>

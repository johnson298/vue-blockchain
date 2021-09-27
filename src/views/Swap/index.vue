<template>
<div class="">
    <div class="root">
        <router-view/>
    </div>
    <dialog-of-choose-token
        :open.sync="open"
        :excludes="excludes"
        @close="close"
        :fromOrigin="fromOrigin"
        :title="$t('coinSelectView.selectTitle')"
    >
    </dialog-of-choose-token>
</div>
</template>
<script>
import DialogOfChooseToken from './components/DialogOfChooseToken.vue';

const CALLBACK_COLLECTIONS = [];
export default {
    components: {DialogOfChooseToken},
    name: 'Swap',
    provide() {
        return {
            chooseToken: this.dialog,
        };
    },
    data() {
        return {
            open: false,
            excludes: [],
            fromOrigin: false,
        };
    },
    methods: {
        listener() {
            return [
                // this.$swap.updateObservable.subscribe(() => {
                //     // console.log('updateObservable');
                //
                //     this.$store.dispatch('swap/fetchTokens');
                // }),
                // // todo init时 触发多次
                // this.$swap.accountStatusObservable.subscribe(() => {
                //
                //     // console.log('accountStatusObservable');
                //     this.$swap.loginStatus().subscribe(isLogin => {
                //         console.log('isLogin ======>', isLogin)
                //         if (isLogin) {
                //             this.$store.dispatch('swap/fetchTokens');
                //         }
                //     });
                //
                // }),
                // // todo init时 触发多次
                // this.$swap.chainId().subscribe((chainID) => {
                //
                //     // console.log('chainId subscribe', chainID);
                //     this.$store.dispatch('swap/fetchTokens');
                // }),
            ];
        },
        dialog(callback, excludes = [], fromOrigin = false) {
            if (!this.open) {
                this.open = true;
            }
            this.fromOrigin = fromOrigin;
            this.excludes = excludes;
            CALLBACK_COLLECTIONS.push(callback);
        },
        close(d) {
            try{
                const fn = CALLBACK_COLLECTIONS[CALLBACK_COLLECTIONS.length-1];
                d && fn(d);
            }catch (e) {

            }
            // while (CALLBACK_COLLECTIONS.length) {
            //     const fn = CALLBACK_COLLECTIONS.shift();
            //     console.error('fn.length', fn, fn.length)
            //     d && fn(d);
            // }
        },
    },
    mounted() {
        // this._subs = this.listener();
        // console.log('_subs', this._subs);

        this.$swap.loginStatus().subscribe(isLogin => {
            console.log('isLogin ======>', isLogin)
            if (isLogin) {
                console.log('logined fetchTokens...')
                this.$store.dispatch('swap/fetchTokens');
            }
        });
    },
    beforeDestroy() {
        // this._subs.forEach((d) => d.unsubscribe());
    },
};
</script>
<style lang="less" scoped>
    ._swap-container {
        max-width: 645px;
    }

    .root {
        border-radius: 8px;
        background-color: transparent;
        //padding: 20px;
    }
</style>

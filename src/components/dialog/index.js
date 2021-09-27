import Dialog from './index.vue'
let $vm,aprilDialog = {};
aprilDialog.install = function (Vue,options){
    if(!$vm){
        const confirmsPlugin = Vue.extend(Dialog);

        $vm = new confirmsPlugin({
            el: document.createElement('div')
        });

        document.body.appendChild($vm.$el);

    }

    $vm.show = false;

    let aprilDialogOption = {
        show(options) {
            $vm.show = true;
            $vm = Object.assign($vm, options)
            if(options.time) setTimeout(_ => $vm.show = true , options.time)
        },
        hide() {
            $vm.show = false;
        }
    };

    if (!Vue.$aprilDialog) {
        Vue.$aprilDialog = aprilDialogOption;
    }

    Vue.prototype.$aprilDialog = Vue.$aprilDialog;
}
export default aprilDialog

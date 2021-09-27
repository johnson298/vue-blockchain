import {combineLatest} from "rxjs";

export const subLogin = {
    data() {
        return {
            $subLogin: null,
            isLogin: false,
        }
    },

    mounted() {
        this.$subLogin = this.subLogin();
    },
    destroyed() {
        this.$subLogin && this.$subLogin.unsubscribe();
    },
    methods: {
        subLogin() {
            return combineLatest([
                this.$swap.loginStatus() && this.$swap.chainId(),
            ]).subscribe(([isLogin, chainId]) => {
                this.isLogin = isLogin;
                if (isLogin) {
                    this.init()
                }
            });
        },
    }

}

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export const routes = [
    // {
    //     path: '/home',
    //     name: 'Home',
    //     title: '',
    //     component: () => import('../views/Index/Index')
    // },
    {
        path: '/trade',
        name: 'Swap',
        title: 'MainView.Swap',
        icon: 'icon-Home',
        component: () => import('../views/Swap/index.vue'),
        redirect: '/trade/swap',
        children: [
            {
                path: 'swap',
                name: 'SwapIndex',
                title: 'MainView.Swap',
                extra: true,
                component: () => import('../views/Swap/Convert.vue')
            },
            {
                path: 'pool',
                name: 'SwapPool',
                title: 'MainView.Pool',
                extra: true,
                icon: 'icon-mining',
                component: () => import('../views/Swap/Pool')
            }
        ]
    },
    {
        path: '/lending',
        name: 'Lending',
        title: 'MainView.Lending',
        icon: 'icon-Home',
        component: () => import('../components/Layout'),
        redirect: '/lending/pool',
        children: [
            {
                path: 'pool',
                name: 'LendingIndex',
                extra: true,
                title: 'Nav.Pool',
                icon: 'icon-Home',
                includes: ['FundPool'],
                component: () => import('../views/PoolList/PoolList')
            },
            {
                path: 'pool/:supply/:currency',
                name: 'FundPool',
                subNavHide: true,
                extra: true,
                title: 'Nav.Pool',
                icon: 'icon-Home',
                component: () => import('../views/FundPool'),
                beforeEnter: (to, from, next) => {
                    if (to.params.currency && to.params.supply) {
                        next();
                    }
                }
            },
            {
                path: 'liquidation',
                name: 'Liquidation',
                title: 'Nav.Liquidation',
                extra: true,
                icon: 'icon-compute',
                component: () => import('../views/Liquidation/Liquidation')
            },
            {
                path: 'my',
                name: 'My',
                title: 'Nav.My',
                extra: true,
                icon: 'icon-account',
                component: () => import('../views/account/account')
            },
        ]
    },
    {
        path: '/governance',
        name: 'Governance',
        title: 'Nav.Government',
        icon: 'icon-gov',
        component: () => import('../views/Governance/Governance')
    },
    {
        path: '/shack',
        name: 'Solo',
        title: 'Solo.title',
        icon: 'icon-gov',
        component: () => import('views/solo')
    },
    {
        path: '/transit',
        name: 'Transit',
        title: 'MainView.Transit',
        icon: '',
        component: () => import('../views/Transit/Transit')
    },
    {
        path: '/ifo',
        name: 'Ifo',
        title: 'MainView.Ifo',
        icon: '',
        component: () => import('../views/Ifo/LaunchPad/LaunchPad')
    },
    {
        path: '/farms',
        name: 'Farms',
        title: 'MainView.Farms',
        icon: '',
        component: () => import('../views/Ifo/LaunchPool/LaunchPool')
    },
    {
        path: '/xburger-pool',
        name: 'XBURGERSHACK',
        title: 'XBURGER Shack',
        icon: '',
        component: () => import('../views/xburger-shack/index')
    },
    {
        path: '/prediction',
        name: 'Prediction',
        title: 'MainView.Prediction',
        icon: '',
        component: () => import('../views/prediction/index')
    }
];

export default new Router({
    mode: process.env.NODE_ENV === 'ipfsview' ? 'hash' : 'history',
    routes: [
        {
            path: '*',
            redirect: '/trade',
        },
        ...routes,
        {
            path: '/test',
            name: 'test',
            component: () => import('../views/test')
        },
        {
            path: '/kline',
            name: 'kline',
            component: () => import('../views/kline')
        }
    ],
    //   to, from, savedPosition
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        };
    }
});

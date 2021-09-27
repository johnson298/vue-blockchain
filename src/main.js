import '@/assets/js/flexible';
import Vue from 'vue';
import vConsole from 'vconsole';
import store from './store/store';
import router from './router';
import i18n from './i18n/i18n';
import mixin from './assets/js/mixin';
import install from './assets/js/met';
import App from './App';
import 'element-ui/lib/theme-chalk/index.css';
import './components/index';
import './assets/less/theme.less';
import './assets/less/base.less';
import './assets/less/ui_reset.less';
import './assets/js/filter';
import aprilDialog from './components/dialog';
import {ProjectCoin, Coin} from './assets/js/coin';
import {SwapInstance} from './assets/swap.init';
import {getIcon} from './assets/js/tokenMap';
import vueAwesomeCountdown from 'vue-awesome-countdown';
import AprilTransition from './components/transition'
import CountJump from './components/countJump'
import { Loadings } from "@/assets/js/loadings";
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

import {
    Button,
    Select,
    Row,
    Table,
    Divider,
    Dialog,
    Col,
    TableColumn,
    Container,
    Input,
    Header,
    Aside,
    Alert,
    Main,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    Tooltip,
    MenuItemGroup,
    Tabs,
    Popover,
    TabPane,
    Switch,
    Form,
    Option,
    FormItem,
    Slider,
    Progress,
    CollapseItem,
    Collapse,
    MenuItem,
    Checkbox,
    Notification,
    Message
} from 'element-ui';
Vue.use(vueAwesomeCountdown, 'vac');

Vue.use(VueAwesomeSwiper);

Vue.config.devtools = process.env.NODE_ENV !== 'production';
if (['production', 'ipfsview'].includes(process.env.NODE_ENV)) {
    window.console.log = () => {};
    window.console.info = () => {};
} else {
    // new vConsole();
    Vue.config.productionTip = false;
}

const components = [
    Button,
    Select,
    Row,
    Table,
    Divider,
    Dialog,
    Col,
    TableColumn,
    Container,
    Input,
    Header,
    Aside,
    Alert,
    Main,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    Tooltip,
    MenuItemGroup,
    Tabs,
    Popover,
    TabPane,
    Switch,
    Form,
    Option,
    FormItem,
    Slider,
    Progress,
    CollapseItem,
    Collapse,
    MenuItem,
    Checkbox,
    Notification,
    AprilTransition,
    CountJump
];

components.forEach((component) => {
    Vue.component(component.name, component);
});

Vue.mixin(mixin);
Vue.use(aprilDialog);
Vue.use(install);
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$load = new Loadings();

Object.defineProperty(Vue.prototype, '$project', {
    value: ProjectCoin,
    writable: false
});

Object.defineProperty(Vue.prototype, '$swap', {
    value: SwapInstance,
    writable: false
});

Object.defineProperty(Vue.prototype, '$icon', {
    value: getIcon,
    writable: false
});

Object.defineProperty(Vue.prototype, '$Subscript', {
    value: {
        hot: ['BUSD'],
        new: []
    },
    writable: false
});

new Vue({
    render: h => h(App),
    router,
    store,
    i18n
}).$mount('#app');

import axios from 'axios';
import Vue from 'vue';

//axios.defaults.timeout = 30000;           //超时时间
//axios.defaults.retry = 3;                 //请求次数
//axios.defaults.retryDelay = 1000;         //请求间隙

if (process.env.NODE_ENV === 'development') {
    //开发环境
    axios.defaults.baseURL = 'http://192.168.1.162:6060';
} else if (process.env.NODE_ENV === 'production'){
    //真实环境
    axios.defaults.baseURL = window.location.origin;
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


window.$axios = Vue.prototype.$axios = axios;
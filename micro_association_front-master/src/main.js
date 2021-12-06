import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css'
import App from './App.vue';
import './mock'
import VueRouter from 'vue-router'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.echarts = require('echarts')

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);
import router from './router.js'
import store from './store.js'
Vue.prototype.$store = store
import instance from './axios.js'
Vue.prototype.$eventBus = new Vue()
Vue.config.productionTip = false
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

Vue.prototype.$axios = instance

import './assets/css/loading.css'

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
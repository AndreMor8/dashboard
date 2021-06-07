import 'bulmaswatch/darkly/bulmaswatch.min.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import routes from './router.js';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

const router = new VueRouter({ mode: 'history', routes });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');
import _ from 'lodash';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './plugins/vant';
import './assets/iconfont/iconfont.css';
import './http/common';

Vue.config.productionTip = false;
Vue.prototype._ = _;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

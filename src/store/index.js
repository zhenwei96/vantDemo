import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isShowTabbar: false,
    },
    mutations: {
        changeIsShowTabbar(state, payload) {
            state.isShowTabbar = payload;
        },
    },
    actions: {},
    modules: {},
});

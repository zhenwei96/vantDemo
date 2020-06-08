import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const subRoutesList = [];
function importAll(r) {
    r.keys().forEach(key => subRoutesList.push(r(key).default));
}
importAll(require.context('./', true, /\.routes\.js/));
const routes = [...subRoutesList, { path: '/', redirect: '/home' }];

// 解决重复路由问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeResolve((to, from, next) => {
    const vm = router.app;
    if (vm.$store) vm.$store.commit('changeIsShowTabbar', !!to.meta.showTabbar);
    next();
});
export default router;

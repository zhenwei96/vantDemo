export default {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/home.vue'),
    children: [],
    meta: {
        // 自定义字段
        requireAuth: true,
        // 是否显示tabbar
        showTabbar: true,
    },
};

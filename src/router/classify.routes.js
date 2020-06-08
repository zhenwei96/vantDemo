export default {
    path: '/classify',
    name: 'Classify',
    component: () => import('@/views/classify/classify.vue'),
    children: [],
    meta: {
        // 自定义字段
        requireAuth: false,
        showTabbar: true,
    },
};

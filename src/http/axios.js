import axios from 'axios';
// 获取token
function getTokenByLocal() {
    const token = sessionStorage.getItem('token') || '';
    return token;
}
// C创建一个axios实例
const service = axios.create({
    baseURL: '/backend',
    timeout: 5000,
});
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// request请求拦截器
service.interceptors.request.use(
    config => {
        const copyConfig = config;
        if (getTokenByLocal()) {
            copyConfig.headers.token = getTokenByLocal(); // 让每个请求携带自定义的token
            // config.headers['ContentType'] = 'application/from-data;charset=utf-8'    //后台接收参数的类型
        }
        return copyConfig;
    },
    error => {
        console.log(error);
        Promise.reject(error);
    },
);

// response响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code === 401) {
            window.location.href = '/login';
        }
        return Promise.resolve(response.data);
    },
    // 进行提示 或者弹窗
    error => Promise.reject(error),
);

export default service;

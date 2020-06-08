import Qs from 'qs';
import vue from 'vue';
import service from './axios';

export const getRequest = async (url, params) => {
    try {
        const res = await service.get(url, params);
        return [res.data, res, null];
    } catch (e) {
        return [null, null, e];
    }
};
export const postRequest = async (url, data) => {
    try {
        const res = await service.post(url, Qs.stringify(data));
        return [res.data, res, null];
    } catch (e) {
        return [null, null, e];
    }
};
vue.prototype.$http = service;

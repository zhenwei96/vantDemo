import { getRequest, postRequest } from '../http/common';
// import { url } from '@/request/apiUrl';

export const getHomeData = (data = {}) => postRequest('/api', data);

export const getTabData = (data = {}) => getRequest('../../static/tabData.json', data);

export const getTabDataList = (url, data = {}) => getRequest(url, data);

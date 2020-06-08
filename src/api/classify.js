import { getRequest, postRequest } from '../http/common';

export const getMenu = (data = {}) => getRequest('../../static/menu.json', data);

export const getHomeData = (data = {}) => postRequest('/api', data);

export const getDataList = (data = {}) => getRequest('../../static/list.json', data);

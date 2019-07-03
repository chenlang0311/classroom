import axios from 'axios';
import config from '../config';

let CRM = config.CRM ;
let setParamsTime = function (params) {
    params = params || {};
    if (params && Object.prototype.toString.call(params) === '[object Object]') params.timestamp = new Date().getTime();
    return params;
};

export const login = params => { return axios.post(`${CRM}/administrators/login`, params).then(res => res); };

export const loginout = params => { return axios.post(`${CRM}/loginout`, params) }
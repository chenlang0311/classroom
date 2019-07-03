import axios from 'axios';
import config from '../config';

let CRM = config.CRM;
let setParamsTime = function (params) {
    params = params || {};
    if (params && Object.prototype.toString.call(params) === '[object Object]') params.timestamp = new Date().getTime();
    return params;
};


//课堂
export const add = params => { return axios.post(`${CRM}/classes/create`, params); };

export const classes_list = params => { return axios.get(`${CRM}/classes/list`, { params: setParamsTime(params) }); };

export const details = (id) => { return axios.get(`${CRM}/classes/details/${id}`); };

export const addPic = params => { return axios.post(`${CRM}/swipers/add`, params); };

export const pic_list = params => { return axios.get(`${CRM}/swipers/list`, { params: setParamsTime(params) }); };

export const pic_deleted = (id) => { return axios.delete(`${CRM}/swipers/delete/${id}`); };

export const update_level = (id, params) => { return axios.put(`${CRM}/swipers/updatelevel/${id}`, params); };

export const class_update = (id, params) => { return axios.put(`${CRM}/classes/update/${id}`, params); };

export const category_list = params => { return axios.get(`${CRM}/categories/list`, { params: setParamsTime(params) }); };

export const orders_list = params => { return axios.get(`${CRM}/orders/list`, { params: setParamsTime(params) }); };

export const calss_deleted = (id) => { return axios.delete(`${CRM}/classes/delete/${id}`); };
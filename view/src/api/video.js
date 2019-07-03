import axios from 'axios';
import config from '../config';

let CRM = config.CRM;
let setParamsTime = function (params) {
    params = params || {};
    if (params && Object.prototype.toString.call(params) === '[object Object]') params.timestamp = new Date().getTime();
    return params;
};

export const video_list = params => { return axios.get(`${CRM}/catalogs/list`, { params: setParamsTime(params) }); };

export const get_sha = params => { return axios.get(`${CRM}/catalogs/sig`, { params: setParamsTime(params) }); };

export const get_video_info = params => { return axios.get(`${CRM}/catalogs/video_info`, { params: setParamsTime(params) }); };

export const post_info = params => { return axios.post(`${CRM}/catalogs/add`, setParamsTime(params)); };

export const video_info = params => { return axios.get(`${CRM}/catalogs/video_info`, { params: setParamsTime(params) })};

export const publish_list = params => { return axios.get(`${CRM}/catalogs/list`, { params: setParamsTime(params) }); };

export const video_publish = params => { return axios.post(`${CRM}/catalogs/add`, setParamsTime(params));};

export const video_delete = id => { return axios.delete(`${CRM}/catalogs/delete/${id}`)};

export const video_details = id => { return axios.get(`${CRM}/catalogs/details/${id}`);};

export const publish = params => { return axios.get(`${CRM}/catalogs/postion`, { params: setParamsTime(params) }); };

export const update_catalogs = (id, params) => { return axios.put(`${CRM}/catalogs/update/${id}`, params); };

export const deleted_catalogs = (id) => { return axios.delete(`${CRM}/catalogs/delete/${id}`); };

export const getqcinfo = params => { return axios.get(`${CRM}/catalogs/getqcinfo`, { params: setParamsTime(params) }); };


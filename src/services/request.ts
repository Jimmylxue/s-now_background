import { createRequest } from '@/core/request/core';
import { message } from 'antd';

export const baseURL = 'https://api.mypandabuy.shop';

export const request = createRequest(
  {
    // baseURL: 'https://api.jimmyxuexue.top',
    // baseURL: 'http://156.251.227.88:9999',
    // baseURL: 'https://apis.jiujiu3c.shop',
    // baseURL: 'http://103.248.229.58:9999', // en 马来站
    // baseURL: 'https://api.nunuapp.shop', // luck 站
    // baseURL: 'https://apis.nunuapp.shop', // shop 站
    // baseURL: 'https://api.shop3c.app', // shop 站
    // baseURL: 'https://apis.shop3c.app', // shop 站
    // baseURL: 'https://api.appbites.shop', // shop 站
    // baseURL: 'http://127.0.0.1:9999', // shop 站
    // baseURL: 'https://api.bitesshop.shop', // shop 站
    // baseURL: 'https://api.pandabuy3c.shop', // shop 站
    // baseURL: 'https://apis.pandabuy3c.shop', // shop 站
    // baseURL: 'https://api3.3cpandabuy.shop', // shop 站
    // baseURL: 'https://api.mypandabuy.shop', // shop 站
    // baseURL: 'https://api.twpandabuy.shop', // shop 站
    // baseURL: 'https://apis.twpandabuy.shop', // shop 站
    baseURL, // shop 站
    timeout: 20000,
  },
  {
    request: {
      onSuccess: (config) => {
        const token = localStorage.getItem('token') || '';
        return {
          ...config,
          headers: {
            Authorization: 'Bearer ' + token, // 请求头中携带token信息
          },
        };
      },
      onError: (error) => {
        console.log('requesyErr', error);
      },
    },
    response: {
      onSuccess: (res) => {
        if (res.data.code === 200) {
          return res.data.result;
        }
        message.error(res.data.result);
        throw new Error(res.data.result);
      },
      onError: (error) => {
        console.log('error', error);
        const status = error.response?.status;
        if (status === 401) {
          message.error('请重新登录');
        } else {
          // @ts-ignore
          message.error(error.response?.data?.message! || error.message);
        }
      },
    },
  },
);

export function get<T>(url: string) {
  return request.get<T>(url);
}

export function post<T, P>(url: string, params: P) {
  return request.post<T, P>(url, params);
}

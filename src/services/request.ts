import { createRequest } from '@/core/request/core';
import { message } from 'antd';

export const request = createRequest(
  {
    // baseURL: 'https://api.jimmyxuexue.top',
    baseURL: 'http://156.251.227.88:9999',
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
        console.log('success', res);
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

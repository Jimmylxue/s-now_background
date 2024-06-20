export { QueryKey, UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';

export type ClientError = {
  code: number;
  message: string;
};

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { ElMessage } from 'element-plus'
// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
  code: number;
  msg: string;
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
  result: T;
}

type TCreateRequestConfig = {
  baseURL: string;
  timeout: number;
};

type TInterceptors = {
  request: {
    onSuccess: (config: AxiosRequestConfig) => any;
    onError: (error: AxiosError) => void;
  };
  response: {
    onSuccess: (response: AxiosResponse) => void;
    onError: (error: AxiosError) => void;
  };
};

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig, interceptors: TInterceptors) {
    // 实例化axios
    this.service = axios.create(config);
    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */

    this.service.interceptors.request.use(
      interceptors.request.onSuccess,
      interceptors.request.onError,
    );
    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      // @ts-ignore
      interceptors.response.onSuccess,
      interceptors.response.onError,
    );
  }
  handleCode(code: number): void {
    switch (code) {
      case 401:
        // ElMessage.error('登录失败，请重新登录')
        break;
      default:
        // ElMessage.error('请求失败')
        break;
    }
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<T> {
    return this.service.get(url, { params });
  }
  post<T, P>(url: string, params?: P): Promise<T> {
    return this.service.post(url, params);
  }
  put<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.put(url, params);
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.delete(url, { params });
  }
}

// 导出一个实例对象
// const request = new RequestHttp(config)

let request: RequestHttp;

export function createRequest(config: TCreateRequestConfig, interceptors: TInterceptors) {
  if (!request) {
    request = new RequestHttp(config, interceptors);
  }
  return request;
}

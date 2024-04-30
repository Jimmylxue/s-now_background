/**
 * 通用的类型定义
 */

interface Result {
  code: number;
  msg: string;
}

export interface ResultData<T = any> extends Result {
  result: T;
}

export type TPageListType = {
  page: number;
  pageSize: number;
};

export type TPageData<T> = {
  page?: number;
  total?: number;
  result: T;
};

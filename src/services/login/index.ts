import { request } from '../request';

export enum Sex {
  '未知',
  '男',
  '女',
}

export type TLoginUser = {
  id?: number;
  username: string;
  avatar: string;
  sex: Sex;
  phone: string;
  createTime?: string;
  mail: string;
};

/** 登录接口 POST /api/login/account */
export async function login(body: any) {
  return request.post('user/login', body);
}

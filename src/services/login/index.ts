import { request } from '../request';

export enum Sex {
  '未知',
  '男',
  '女',
}

export enum Role {
  '未定义',
  '普通用户',
  '管理员',
}

export type TLoginUser = {
  id?: number;
  username: string;
  avatar: string;
  sex: Sex;
  phone: string;
  createTime?: string;
  mail: string;
  role: Role;
};

/** 登录接口 POST /api/login/account */
export async function login(body: any) {
  return request.post('user/login', body);
}

/** 注册接口 POST /api/login/account */
export async function register(body: any) {
  return request.post('user/register', body);
}

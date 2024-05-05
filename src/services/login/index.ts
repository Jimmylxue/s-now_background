import { UseMutationOptions, useMutation } from 'react-query';
import { post, request } from '../request';
import { ClientError } from '@/core/request/core';

export enum Sex {
  '未知',
  '男',
  '女',
}

export enum ExamStatus {
  未通过考试,
  已通过考试,
}

export type TLoginUser = {
  id?: number;
  username: string;
  avatar: string;
  createTime?: string;
  role: ERole;
  sex: Sex;
  judgeExamination: ExamStatus;
};

export enum ERole {
  管理员 = 'admin',
  法官 = 'judge',
  买家 = 'consumer',
  卖家 = 'provider',
}

/** 登录接口 POST /api/login/account */
export async function login(body: any) {
  return request.get('login', body);
}

/** 登录接口 POST /api/login/account */
export async function getUserByUsername(name: any) {
  return request.get(`loginuser/${name}`);
}

/** 登录接口 POST /api/login/account */
export async function register(body: any) {
  return request.post('enroll', body);
}

/** 登录接口 POST /api/login/account */
export async function updateUser(body: any) {
  return request.post('updateUser', body);
}

type TRegisterParams = {
  username: string;
  password: string;
};

export function useRegister(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TRegisterParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TRegisterParams
  >((data) => post('/encroll', data), options);
}

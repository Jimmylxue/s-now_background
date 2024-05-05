import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import { TAddUser, TEditUser, TLetterListParams, TLetterRecordUserParams, TUser } from './type';
import { get, post } from '../request';
import { TPageData } from '../type';
import { TLoginUser } from '../login';

export function useMemberList(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TLoginUser[]>, ClientError>,
) {
  return useQuery<TPageData<TLoginUser[]>, ClientError>(
    queryKey,
    () => {
      console.log('vvv', variable);
      return get('/getUsers', variable);
    },
    config,
  );
}

export function useAddUser(options?: UseMutationOptions<boolean, ClientError, TAddUser>) {
  return useMutation<boolean, ClientError, TAddUser>(
    (data) => post('/user/register', data),
    options,
  );
}

export function useEditUser(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TEditUser
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TEditUser
  >((data) => post('/updateUser', data), options);
}

export function useDelUser(
  options?: UseMutationOptions<
    boolean,
    ClientError,
    {
      id: number;
    }
  >,
) {
  return useMutation<
    boolean,
    ClientError,
    {
      id: number;
    }
  >((data) => post('/deleteUser', data), options);
}

export function useSendLetter(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    {
      letterId: number;
      userIds: number[];
    }
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    {
      letterId: number;
      userIds: number[];
    }
  >((data) => post('/letter/sendSome', data), options);
}

export function useLetterRecordUserList(
  queryKey: QueryKey,
  variable: TLetterRecordUserParams,
  config?: UseQueryOptions<TUser[], ClientError>,
) {
  return useQuery<TUser[], ClientError>(
    queryKey,
    () => post('/letter/record/user', variable),
    config,
  );
}

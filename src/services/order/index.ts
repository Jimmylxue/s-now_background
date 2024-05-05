import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import { TAddUser, TEditUser, TLetterListParams, TLetterRecordUserParams, TOrder } from './type';
import { get, post } from '../request';
import { TPageData } from '../type';

export function useOrder(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TOrder[]>, ClientError>,
) {
  return useQuery<TPageData<TOrder[]>, ClientError>(
    queryKey,
    () => {
      return get('/order/get', variable);
    },
    config,
  );
}

export function useExplain(options?: UseMutationOptions<boolean, ClientError, TAddUser>) {
  return useMutation<boolean, ClientError, TAddUser>(
    (data) => get('/order/explain', data),
    options,
  );
}

export function useDownloadFile(options?: UseMutationOptions<boolean, ClientError, TAddUser>) {
  return useMutation<boolean, ClientError, TAddUser>((data) => post('/download', data), options);
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
  >((data) => post('/user/del', data), options);
}

/**
 * 开庭招募法官
 */
export function useGetJudge(
  options?: UseMutationOptions<boolean, ClientError, { orderId: string }>,
) {
  return useMutation<boolean, ClientError, { orderId: string }>(
    (data) => get('/court/getJudge', data),
    options,
  );
}

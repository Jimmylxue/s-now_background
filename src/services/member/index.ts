import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import { TAddUser, TEditUser, TLetterListParams, TLetterRecordUserParams, TUser } from './type';
import { post } from '../request';
import { TPageData } from '../type';

export function useMemberList(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TUser[]>, ClientError>,
) {
  return useQuery<TPageData<TUser[]>, ClientError>(
    queryKey,
    () => post('/message/list', variable),
    config,
  );
}

export function useAddUser(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddUser
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddUser
  >((data) => post('/message/add', data), options);
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
  >((data) => post('/message/update', data), options);
}

export function useDelUser(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    {
      userId: number;
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
      userId: number;
    }
  >((data) => post('/message/del', data), options);
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

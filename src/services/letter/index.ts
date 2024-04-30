import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import {
  TAddLetterParams,
  TLetterItem,
  TLetterListParams,
  TLetterRecordUserParams,
  TUser,
} from './type';
import { post } from '../request';
import { TPageData } from '../type';

export function useLetterList(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TLetterItem[]>, ClientError>,
) {
  return useQuery<TPageData<TLetterItem[]>, ClientError>(
    queryKey,
    () => post('/message/list', variable),
    config,
  );
}

export function useAddLetter(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddLetterParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddLetterParams
  >((data) => post('/message/add', data), options);
}

export function useEditLetter(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddLetterParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddLetterParams
  >((data) => post('/message/update', data), options);
}

export function useDelLetter(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    {
      letterId: number;
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

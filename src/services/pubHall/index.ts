import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import { get, post } from '../request';
import { TPageData } from '../type';
import { TLetterListParams } from '../member/type';

export type TPubHallItem = {
  court: {
    id: number;
    number: number;
    orderId: string;
    startTime: string;
    status: number;
    winUserId: number;
  };
  orderExplainMessages: {
    id: number;
    messageType: number;
    orderId: number;
    userName?: string;
    userText: string;
    filePath: string;
  }[];
};

/**
 * 查看公示案件
 */
export function usePubHall(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<any, ClientError>,
) {
  return useQuery<any, ClientError>(
    queryKey,
    () => {
      return get('/court/resultExplain', variable);
    },
    config,
  );
}

/**
 * 查看公示案件评论
 */
export function usePubComment(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<any, ClientError>,
) {
  return useQuery<any, ClientError>(
    queryKey,
    () => {
      return get('/comment/listPage', variable);
    },
    config,
  );
}

export function useAddComment(
  options?: UseMutationOptions<boolean, ClientError, { orderId: string; text: string }>,
) {
  return useMutation<boolean, ClientError, { orderId: string; text: string }>(
    (data) => get('/comment/add', data),
    options,
  );
}

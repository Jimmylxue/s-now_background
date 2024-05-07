import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import { get } from '../request';
import { TPageData } from '../type';
import { TLetterListParams } from '../member/type';

export type TMyCaseItem = {
  id: number;
  orderId: string;
  userId1: number;
  user1: string;
  userId2: number;
  user2: string;
  judged: boolean;
};

/**
 * 查看法官接收的案件
 */
export function useJudgeCat(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TMyCaseItem[]>, ClientError>,
) {
  return useQuery<TPageData<TMyCaseItem[]>, ClientError>(
    queryKey,
    () => {
      return get('/judge/cat', variable);
    },
    config,
  );
}

/**
 * 查看详细信息-query
 */
export function useJudgeCatQuery(
  queryKey: QueryKey,
  variable: { orderId: string },
  config?: UseQueryOptions<any, ClientError>,
) {
  return useQuery<any, ClientError>(
    queryKey,
    () => {
      return get('/judge/catExplain', variable);
    },
    config,
  );
}

/**
 * 查看详细信息
 */
export function useCatExplain(
  options?: UseMutationOptions<boolean, ClientError, { orderId: string }>,
) {
  return useMutation<boolean, ClientError, { orderId: string }>(
    (data) => get('/judge/catExplain', data),
    options,
  );
}

/**
 * 法官做出审判
 */
export function useJudged(
  options?: UseMutationOptions<boolean, ClientError, { orderId: string; upUserId: number }>,
) {
  return useMutation<boolean, ClientError, { orderId: string; upUserId: number }>(
    (data) => get('/judge/judged', data),
    options,
  );
}

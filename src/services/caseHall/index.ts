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

export type TCaseHallItem = {
  orderId: string;
};

/**
 * 查看正在招募法官的案件
 */
export function useCaseHall(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TCaseHallItem[]>, ClientError>,
) {
  return useQuery<TPageData<TCaseHallItem[]>, ClientError>(
    queryKey,
    () => {
      return get('/judge/listPage', variable);
    },
    config,
  );
}

/**
 * 加入评审团
 */
export function useJoinJudge(
  options?: UseMutationOptions<boolean, ClientError, { orderId: string }>,
) {
  return useMutation<boolean, ClientError, { orderId: string }>(
    (data) => get(`/judge/join`, data),
    options,
  );
}

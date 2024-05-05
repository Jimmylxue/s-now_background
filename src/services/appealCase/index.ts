import { QueryKey, UseQueryOptions, useQuery } from 'react-query';
import { TLetterListParams } from '../member/type';
import { TPageData } from '../type';
import { get } from '../request';
import { ClientError } from '@/core/request/core';
import { TOrder } from '../order/type';

export type TAppealCaseItem = TOrder & {
  orderExplainMessage: {
    userId: number;
    id: number;
    messageType: number;
    orderId: number;
    userText: string;
    filePath: string;
  };
};

/**
 * 查看已申诉的订单
 */
export function useAppealCaseList(
  queryKey: QueryKey,
  variable: TLetterListParams,
  config?: UseQueryOptions<TPageData<TAppealCaseItem[]>, ClientError>,
) {
  return useQuery<TPageData<TAppealCaseItem[]>, ClientError>(
    queryKey,
    () => {
      return get('/court/listPage', variable);
    },
    config,
  );
}

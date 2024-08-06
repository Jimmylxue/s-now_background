import { ClientError, QueryKey, UseQueryOptions, useQuery } from '@/core/request/core';
import { post } from '@/services/request';
import { TPageData, TPageListType } from '@/services/type';

export type TAddressListParams = TPageListType & {
  addressId?: number;
  username?: string;
  phone?: string;
};

export type TAddressItem = {
  addressId: number;
  province: string;
  city: string;
  area: string;
  detail: string;
  username: string;
  phone: string;
  createdTime: Date;
  updateTime: Date;
};

export function useAddressList(
  queryKey: QueryKey,
  variable: TAddressListParams,
  config?: UseQueryOptions<TPageData<TAddressItem[]>, ClientError>,
) {
  return useQuery<TPageData<TAddressItem[]>, ClientError>(
    queryKey,
    () => post('/address/list', variable),
    config,
  );
}

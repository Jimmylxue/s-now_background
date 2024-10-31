import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
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
  memberCode: string;
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

export type TConfigItem = {
  configId: number;
  inviteCode: string;
  lineCode: string;
};

export function useSystemConfig(
  queryKey: QueryKey,
  variable: any,
  config?: UseQueryOptions<TPageData<TConfigItem[]>, ClientError>,
) {
  return useQuery<TPageData<TConfigItem[]>, ClientError>(
    queryKey,
    () => post('/address/configList', variable),
    config,
  );
}

export function useEditConfig(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    {
      inviteCode: string;
      lineCode: string;
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
      inviteCode: string;
      lineCode: string;
    }
  >((data) => post('/address/editConfig', data), options);
}

export function useGenerateLink(options?: UseMutationOptions<string, ClientError, any>) {
  return useMutation<string, ClientError, any>((data) => post('/address/generate', data), options);
}

export function useDownloadFile(
  options?: UseMutationOptions<string, ClientError, TAddressListParams>,
) {
  return useMutation<string, ClientError, TAddressListParams>(
    (data) => post('/address/export', data),
    options,
  );
}

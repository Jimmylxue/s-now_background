import {
  ClientError,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@/core/request/core';
import { TUser } from '@/services/member/type';
import { post } from '@/services/request';
import { TPageData, TPageListType } from '@/services/type';

export type TProductTypeListParams = TPageListType & {
  id?: number;
  title?: string;
};

export type TProductTypeItem = {
  id: number;
  title: string;
  subTitle: string;
  desc: string;
  imgSrc: string;
  createdTime: string;
  user: TUser;
};

export function useProductTypeList(
  queryKey: QueryKey,
  variable: TProductTypeListParams,
  config?: UseQueryOptions<TPageData<TProductTypeItem[]>, ClientError>,
) {
  return useQuery<TPageData<TProductTypeItem[]>, ClientError>(
    queryKey,
    () => post('/productType/list', variable),
    config,
  );
}

type TAddProductTypeParams = {
  title: string;
  subTitle: string;
  desc: string;
  imgSrc: string;
};

export function useAddProductType(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddProductTypeParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddProductTypeParams
  >((data) => post('/productType/add', data), options);
}

type TEditProductType = TAddProductTypeParams & {
  id: number;
};

export function useEditProductType(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TEditProductType
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TEditProductType
  >((data) => post('/productType/edit', data), options);
}

type TDelProductTypeParams = {
  id: number;
};

export function useDelProductType(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TDelProductTypeParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TDelProductTypeParams
  >((data) => post('/productType/del', data), options);
}

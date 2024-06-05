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
import { TProductTypeItem } from '../productType';

export type TProductListParams = TPageListType & {
  id?: number;
  title?: string;
};

export enum EProductStatus {
  有库存 = 1,
  售罄,
}

export const EProductStatusConst = [
  {
    label: '有库存',
    value: EProductStatus.有库存,
  },
  {
    label: '售罄',
    value: EProductStatus.售罄,
  },
];

export enum ESaleStatus {
  上架中 = 1,
  下架中,
}

export const ESaleStatusConst = [
  {
    label: '上架中',
    value: ESaleStatus.上架中,
  },
  {
    label: '下架中',
    value: ESaleStatus.下架中,
  },
];

export type TProductItem = {
  productId: number;
  title: string;
  subTitle: string;
  desc: string;
  imgSrc: string;
  videoSrc: string;
  createdTime: string;
  user: TUser;
  price: number;
  productTypeId: number;
  productType: TProductTypeItem;
  saleStatue: ESaleStatus;
  status: EProductStatus;
};

export function useProductList(
  queryKey: QueryKey,
  variable: TProductListParams,
  config?: UseQueryOptions<TPageData<TProductItem[]>, ClientError>,
) {
  return useQuery<TPageData<TProductItem[]>, ClientError>(
    queryKey,
    () => post('/product/list', variable),
    config,
  );
}

type TAddProductParams = {
  title: string;
  subTitle: string;
  desc: string;
  imgSrc: string;
};

export function useAddProduct(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddProductParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TAddProductParams
  >((data) => post('/product/add', data), options);
}

type TEditProduct = TAddProductParams & {
  productId: number;
};

export function useEditProduct(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TEditProduct
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TEditProduct
  >((data) => post('/product/edit', data), options);
}

type TDelProductParams = {
  productId: number;
};

export function useDelProduct(
  options?: UseMutationOptions<
    {
      code: number;
      result: string;
    },
    ClientError,
    TDelProductParams
  >,
) {
  return useMutation<
    {
      code: number;
      result: string;
    },
    ClientError,
    TDelProductParams
  >((data) => post('/product/del', data), options);
}

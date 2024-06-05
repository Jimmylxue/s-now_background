import { PlusOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Popconfirm, Select, message } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { ProductModal } from './components/ProductModal';
import { TProductTypeListParams, useProductTypeList } from '@/services/shop/productType';
import {
  EProductStatus,
  EProductStatusConst,
  ESaleStatus,
  ESaleStatusConst,
  TProductItem,
  useAddProduct,
  useDelProduct,
  useEditProduct,
  useProductList,
} from '@/services/shop/product';

const statusMap = {
  [EProductStatus.有库存]: '有库存',
  [EProductStatus.售罄]: '售罄',
};

const saleStatusMap = {
  [ESaleStatus.上架中]: '上架中',
  [ESaleStatus.下架中]: '下架中',
};

const TableList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const chooseItem = useRef<TProductItem>();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [params, setParams] = useState<TProductTypeListParams>({
    page: 1,
    pageSize: 10,
  });

  const { data: productTypeList } = useProductTypeList(
    ['productTypeList'],
    { page: 1, pageSize: 1000 },
    {
      onSuccess: () => {},
      refetchOnWindowFocus: false,
    },
  );

  const { data, refetch } = useProductList(['productList', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync } = useAddProduct({
    onSuccess: successCallBack,
  });
  const { mutateAsync: editProduct } = useEditProduct({
    onSuccess: successCallBack,
  });

  const { mutateAsync: delProduct } = useDelProduct({
    onSuccess: successCallBack,
  });

  const productTypeMap = useMemo(() => {
    return (
      productTypeList?.result.map((item) => {
        return {
          label: item.title,
          value: item.id,
        };
      }) || []
    );
  }, [productTypeList]);

  const columns: ProColumns<TProductItem>[] = [
    {
      title: '商品名称',
      dataIndex: 'title',
      render: (_, { title, subTitle, imgSrc }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={imgSrc?.split('@')?.[0]} alt="" className=" rounded-full size-[50px]" />
            <div className="ml-2">
              <div>{title}</div>
              <div>{subTitle}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (val) => {
        return <div>{val}</div>;
      },
    },
    {
      title: '所属分类',
      dataIndex: 'productTypeId',
      render: (_, { productType }) => {
        return (
          <div>
            <div>{productType.title}</div>
            <div>{productType.subTitle}</div>
          </div>
        );
      },
      renderFormItem() {
        return <Select options={productTypeMap} />;
      },
    },
    {
      title: '上架状态',
      dataIndex: 'saleStatue',
      render: (_, { saleStatue }) => {
        return <div>{saleStatusMap[saleStatue]}</div>;
      },
      renderFormItem() {
        return <Select options={ESaleStatusConst} />;
      },
    },
    {
      title: '库存状态',
      dataIndex: 'status',
      render: (_, { status }) => {
        return <div>{statusMap[status]}</div>;
      },
      renderFormItem() {
        return <Select options={EProductStatusConst} />;
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      render: (val) => {
        return <div>{val}</div>;
      },
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          onClick={() => {
            formType.current = 'EDIT';
            chooseItem.current = record;
            setFormOpen(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          placement="top"
          title={'确定删除吗？'}
          okText="Yes"
          cancelText="No"
          onConfirm={async () => {
            await delProduct({ productId: record.productId });
          }}
        >
          <Button type="primary" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TProductItem, API.PageParams>
          headerTitle={'商品类型'}
          key={'letterId'}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.page,
            pageSize: params.pageSize,
            onChange: (pageNum, pageSize) => setParams({ ...params, page: pageNum, pageSize }),
          }}
          search={{
            labelWidth: 0,
          }}
          // @ts-ignore
          request={({ current, pageSize, price, ...params }: any) => {
            setParams({ ...params, price: Number(price), page: current, pageSize });
          }}
          options={{ reload: false }}
          dataSource={data?.result || []}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                formType.current = 'ADD';
                chooseItem.current = undefined;
                setFormOpen(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
          columns={columns}
        />
        <ProductModal
          type="ADD"
          selectItem={chooseItem.current}
          productTypeMap={productTypeMap}
          onOk={async (values) => {
            const { imgSrc, videoSrc, ...args } = values;
            if (formType.current === 'ADD') {
              await mutateAsync({
                ...args,
                imgSrc: imgSrc?.join('@'),
                videoSrc: videoSrc?.join('@'),
              });
            } else {
              await editProduct({
                ...values,
                imgSrc: imgSrc?.join('@'),
                videoSrc: videoSrc?.join('@'),
                productId: chooseItem.current?.productId,
              });
            }

            setFormOpen(false);
          }}
          onCancel={() => {
            setFormOpen(false);
          }}
          open={formOpen}
        />
      </PageContainer>
    </>
  );
};
export default TableList;

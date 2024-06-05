import { PlusOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import { ProductTypeModal } from './components/ProductTypeModal';

import {
  TProductTypeItem,
  TProductTypeListParams,
  useAddProductType,
  useDelProductType,
  useEditProductType,
  useProductTypeList,
} from '@/services/shop/productType';

const TableList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const chooseItem = useRef<TProductTypeItem>();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [params, setParams] = useState<TProductTypeListParams>({
    page: 1,
    pageSize: 10,
  });

  const { data, refetch } = useProductTypeList(['productTypeList', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync } = useAddProductType({
    onSuccess: successCallBack,
  });
  const { mutateAsync: editProductType } = useEditProductType({
    onSuccess: successCallBack,
  });

  const { mutateAsync: delProductType } = useDelProductType({
    onSuccess: successCallBack,
  });

  const columns: ProColumns<TProductTypeItem>[] = [
    {
      title: '分类图片',
      dataIndex: 'imgSrc',
      // tip: 'The rule name is the unique key',
      render: (_, { imgSrc }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={imgSrc} alt="" className=" rounded-full size-[50px]" />
          </div>
        );
      },
      search: false,
    },
    {
      title: '标题',
      dataIndex: 'title',
      // tip: 'The rule name is the unique key',
      render: (val) => {
        return val;
      },
    },
    {
      title: '副标题',
      dataIndex: 'subTitle',
      // tip: 'The rule name is the unique key',
      render: (val) => {
        return val;
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
            await delProductType({ id: record.id });
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
        <ProTable<TProductTypeItem, API.PageParams>
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
          request={({ current, pageSize, ...params }: any) => {
            setParams({ ...params, page: current, pageSize });
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
        <ProductTypeModal
          type="ADD"
          selectItem={chooseItem.current}
          onOk={async (values) => {
            const { imgSrc, ...args } = values;
            if (formType.current === 'ADD') {
              await mutateAsync({ ...args, imgSrc: imgSrc?.[0] });
            } else {
              await editProductType({ ...values, imgSrc: imgSrc?.[0], id: chooseItem.current?.id });
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

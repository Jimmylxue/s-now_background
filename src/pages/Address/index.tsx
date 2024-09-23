import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Input, Select } from 'antd';
import React, { useState } from 'react';
import { baseFormatTime, convertLondonToBeijing } from '@/utils/time';
import { TAddressItem, useAddressList } from '@/services/address';

const productTypeMap = {
  1: '充电宝',
  2: 'iphone',
};

const MemberList: React.FC = () => {
  const [params, setParams] = useState<TLetterListParams>({
    page: 1,
    pageSize: 10,
  });

  const { data, refetch } = useAddressList(['addressList', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const columns: ProColumns<TAddressItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      render: (_, { username }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className=" ml-2">{username}</span>
          </div>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      renderText: (_, { phone }) => phone,
    },
    {
      title: '会员码',
      dataIndex: 'memberCode',
      search: true,
    },
    {
      title: '所属省',
      dataIndex: 'province',
      renderText: (province) => province || '-',
      renderFormItem() {
        return <Input />;
      },
      search: false,
    },
    {
      title: '所属市',
      dataIndex: 'city',
      renderText: (city) => city || '-',
      renderFormItem() {
        return <Input />;
      },
      search: false,
    },
    {
      title: '详细地址',
      dataIndex: 'detail',
      width: 250,
      renderText: (detail) => detail || '-',
      renderFormItem() {
        return <Input />;
      },
      search: false,
    },
    {
      title: '超商门市',
      dataIndex: 'shop',
      renderText: (shop) => shop || '-',
      search: false,
    },
    {
      title: '绑定商品',
      dataIndex: 'productType',
      // @ts-ignore
      renderText: (productType) => productTypeMap[productType] || '-',
      renderFormItem() {
        return (
          <Select
            allowClear
            options={[
              { label: '充电宝', value: 1 },
              { label: 'iphone', value: 2 },
            ]}
          />
        );
      },
    },
    {
      title: 'sku',
      dataIndex: 'sku',
      renderText: (val) => {
        return Object.values(JSON.parse(val || '{}')).join('-');
      },
      search: false,
    },
    {
      title: '添加时间',
      dataIndex: 'createdTime',
      search: false,
      renderText: (val) => {
        return convertLondonToBeijing(val) || '-';
      },
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TAddressItem, API.PageParams>
          headerTitle={'用户列表'}
          key={'id'}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.page,
            pageSize: params.pageSize,
            onChange: (pageNum, pageSize) => setParams({ ...params, page: pageNum, pageSize }),
          }}
          search={{
            labelWidth: 120,
          }}
          // @ts-ignore
          request={({ current, pageSize, ...params }: any) => {
            setParams({
              ...params,
              page: current,
              pageSize,
              username: params.username || undefined,
              phone: params.phone || undefined,
              memberCode: params.memberCode || undefined,
            });
            refetch();
          }}
          dataSource={data?.result || []}
          // toolBarRender={() => [
          //   <Button
          //     type="primary"
          //     key="primary"
          //     onClick={() => {
          //       formType.current = 'ADD';
          //       chooseUser.current = undefined;
          //       setFormOpen(true);
          //     }}
          //   >
          //     <PlusOutlined /> 新建
          //   </Button>,
          // ]}
          columns={columns}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, DatePicker, Input, message, Select } from 'antd';
import React, { useState } from 'react';
import { convertLondonToBeijing } from '@/utils/time';
import { TAddressItem, useAddressList, useDownloadFile } from '@/services/address';
import dayjs from 'dayjs';
import { baseURL } from '@/services/request';

const { RangePicker } = DatePicker;

const productTypeMap = {
  1: '充电宝',
  2: 'iphone',
};

const productLinkTypeMap = {
  1: '临时链接',
  2: '常规链接',
};

const MemberList: React.FC = () => {
  const [params, setParams] = useState<TLetterListParams>({
    page: 1,
    pageSize: 10,
    // startTime: dayjs().startOf('day'),
    // endTime: dayjs().endOf('day'),
  });

  const { data, refetch, isFetching } = useAddressList(['addressList', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const { mutateAsync, isLoading } = useDownloadFile({
    onSuccess: () => {
      message.success('导出成功，请稍后');
    },
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
      title: '商品链接类型',
      dataIndex: 'productLinkType',
      // @ts-ignore
      renderText: (productLinkType) => productLinkTypeMap[productLinkType] || '-',
      renderFormItem() {
        return (
          <Select
            allowClear
            options={[
              { label: '临时链接', value: 1 },
              { label: '常规链接', value: 2 },
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
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1].split(' ')[0] + ' 23:59:59',
          };
        },
      },
      renderFormItem: () => {
        return <RangePicker required />;
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择时间',
          },
        ],
      },
      fieldProps: {
        required: true,
      },
      initialValue: [dayjs().startOf('day'), dayjs().endOf('day')],
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
          loading={isFetching}
          form={{
            ignoreRules: false,
          }}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.page,
            pageSize: params.pageSize,
            onChange: (pageNum, pageSize) => setParams({ ...params, page: pageNum, pageSize }),
          }}
          search={{
            labelWidth: 120,
            collapsed: false,
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
              startTime: params.startTime,
              endTime: params.endTime,
            });
            refetch();
          }}
          dataSource={data?.result || []}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              loading={isLoading}
              onClick={async () => {
                // await mutateAsync(params);
                const response = await fetch(`${baseURL}/address/export`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(params),
                });
                if (response.ok) {
                  const blob = await response.blob(); // 获取响应的 Blob 对象
                  const url = window.URL.createObjectURL(blob); // 创建一个 URL 对象
                  const a = document.createElement('a'); // 创建一个链接元素
                  a.href = url;
                  a.download = 'Address.xlsx'; // 指定下载文件名
                  document.body.appendChild(a); // 将链接添加到 DOM
                  a.click(); // 触发点击事件
                  a.remove(); // 移除链接
                  window.URL.revokeObjectURL(url); // 释放 URL 对象
                } else {
                  console.error('下载失败:', response.statusText);
                }
              }}
            >
              导出报表
            </Button>,
          ]}
          columns={columns}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

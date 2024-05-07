import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { CommitModal } from './components/CommitModal';
import { useExplain, useOrder } from '@/services/order';
import { EOrderStatus, TOrder, orderStatusMap } from '@/services/order/type';

const MemberList: React.FC = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const currentChooseOrder = useRef<TOrder>();
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  const messageType = useRef<0 | 1>(0);

  const { data, refetch } = useOrder(['order', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync: explain } = useExplain({
    onSuccess: successCallBack,
  });

  const columns: ProColumns<TOrder>[] = [
    {
      title: '订单id',
      dataIndex: 'orderId',
      width: 300,
      render: (val) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className=" ml-2">{val}</span>
          </div>
        );
      },
    },
    {
      title: '申诉状态',
      dataIndex: 'orderStatus',
      width: 80,
      renderText: (_, { orderStatus }) => orderStatusMap[orderStatus],
      search: false,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 200,
      renderText: (val) => val || '-',
      search: false,
    },
    {
      title: '申诉时间',
      dataIndex: 'explainTime',
      width: 200,
      renderText: (val) => val || '-',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 200,
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          disabled={record.orderStatus !== EOrderStatus.未申诉}
          onClick={() => {
            messageType.current = 0;
            currentChooseOrder.current = record;
            setFormOpen(true);
          }}
        >
          申诉
        </Button>,
        <Button
          type="primary"
          disabled={record.orderStatus !== EOrderStatus.已开庭}
          onClick={() => {
            messageType.current = 1;
            currentChooseOrder.current = record;
            setFormOpen(true);
          }}
        >
          补充材料
        </Button>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TOrder, API.PageParams>
          headerTitle={'用户列表'}
          key={'id'}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.current,
            pageSize: params.size,
            onChange: (pageNum, pageSize) =>
              setParams({ ...params, current: pageNum, size: pageSize }),
          }}
          search={{
            labelWidth: 120,
          }}
          // @ts-ignore
          request={({ current, pageSize, ...params }: any) => {
            setParams({ ...params, current, size: pageSize });
            refetch();
          }}
          dataSource={data?.records || []}
          columns={columns}
        />
        <CommitModal
          onOk={async (values) => {
            await explain({
              ...values,
              id: currentChooseOrder.current?.id,
              orderId: currentChooseOrder.current?.orderId,
              messageType: messageType.current,
            });
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
export default MemberList;

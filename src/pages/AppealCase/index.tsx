import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Select, message } from 'antd';
import React, { useRef, useState } from 'react';
import { CommitModal } from './components/CommitModal';
import { RecordModal } from './components/RecordModal';
import { sexConst } from '@/services/member/type';
import { useExplain, useGetJudge, useOrder } from '@/services/order';
import { EOrderStatus, TOrder, orderStatusMap } from '@/services/order/type';
import { TAppealCaseItem, useAppealCaseList } from '@/services/appealCase';

const MemberList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [recordUserShow, setRecordUserShow] = useState<boolean>(false);

  const currentChooseOrder = useRef<TOrder>();
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  /**
   * 查看已申诉的订单，用于判断是否开庭
   */
  const { data, refetch } = useAppealCaseList(['appealOrder', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  console.log('data~', data);

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync: explain } = useExplain({
    onSuccess: successCallBack,
  });

  const { mutateAsync: getJudge } = useGetJudge({
    onSuccess: successCallBack,
  });

  const columns: ProColumns<TAppealCaseItem>[] = [
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
      // search: false,
    },
    {
      title: '申诉状态',
      dataIndex: 'orderStatus',
      width: 80,
      renderText: (_, { orderStatus }) => orderStatusMap[orderStatus],
      renderFormItem() {
        return <Select options={sexConst} />;
      },
      search: false,
    },
    {
      title: '申诉评语',
      dataIndex: 'orderExplainMessage',
      width: 80,
      renderText: (_, { orderExplainMessage }) => orderExplainMessage.userText,
      renderFormItem() {
        return <Select options={sexConst} />;
      },
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
          disabled={record.orderStatus !== EOrderStatus.已申诉}
          onClick={async () => {
            try {
              await getJudge({ orderId: record.orderId });
            } catch (error) {}
          }}
        >
          招募法官
        </Button>,
        <Button
          type="primary"
          onClick={async () => {
            try {
              await getJudge({ orderId: record.orderId });
            } catch (error) {}
          }}
        >
          下载资料
        </Button>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TAppealCaseItem, API.PageParams>
          headerTitle={'申诉案件列表'}
          key={'id'}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.current,
            pageSize: params.size,
            onChange: (pageNum, pageSize) =>
              setParams({ ...params, current: pageNum, size: pageSize }),
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
            });
            setFormOpen(false);
          }}
          onCancel={() => {
            setFormOpen(false);
          }}
          open={formOpen}
        />
        <RecordModal
          open={recordUserShow}
          onOk={() => {
            setRecordUserShow(false);
          }}
          onCancel={() => {
            setRecordUserShow(false);
          }}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

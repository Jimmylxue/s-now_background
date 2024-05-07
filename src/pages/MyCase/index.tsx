import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { RecordModal } from './components/RecordModal';
import { TMyCaseItem, useJudgeCat, useJudged } from '@/services/myCase';
import { SupportModal } from './components/Support';

const MemberList: React.FC = () => {
  const [recordShow, setRecordShow] = useState<boolean>(false);
  const [supportShow, setSupportShow] = useState<boolean>(false);

  const currentChooseOrder = useRef<TMyCaseItem>();
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  const { data, refetch } = useJudgeCat(['order', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: judged } = useJudged({
    onSuccess() {
      successCallBack();
    },
  });

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const columns: ProColumns<TMyCaseItem>[] = [
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
      title: '用户1',
      dataIndex: 'user1',
      width: 300,
      search: false,
    },

    {
      title: '用户2',
      dataIndex: 'user2',
      width: 300,
      search: false,
    },

    {
      title: '开始时间',
      dataIndex: 'joinTime',
      width: 350,
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
          onClick={async () => {
            currentChooseOrder.current = record;
            setRecordShow(true);
          }}
        >
          案件详情
        </Button>,
        <Button
          type="primary"
          disabled={!!record.judged}
          onClick={async () => {
            currentChooseOrder.current = record;
            setSupportShow(true);
          }}
        >
          投票
        </Button>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TMyCaseItem, API.PageParams>
          headerTitle={'我的案件'}
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
          toolBarRender={() => []}
          columns={columns}
        />
        <RecordModal
          orderId={currentChooseOrder.current?.orderId!}
          open={recordShow}
          onOk={() => {
            setRecordShow(false);
          }}
          onCancel={() => {
            setRecordShow(false);
          }}
        />
        <SupportModal
          chooseOrder={currentChooseOrder.current!}
          open={supportShow}
          onOk={async (val) => {
            if (!val) {
              setSupportShow(false);
              return;
            }
            await judged({
              orderId: currentChooseOrder.current?.orderId!,
              upUserId: val,
            });
            setSupportShow(false);
          }}
          onCancel={() => {
            setSupportShow(false);
          }}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

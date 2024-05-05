import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Select, message } from 'antd';
import React, { useRef, useState } from 'react';
import { CommitModal } from './components/CommitModal';
import { RecordModal } from './components/RecordModal';
import { useAddUser, useDelUser, useEditUser } from '@/services/member';
import { sexConst } from '@/services/member/type';
import { useExplain, useOrder } from '@/services/order';
import { TOrder, orderStatusMap } from '@/services/order/type';
import { useCaseHall, useJoinJudge } from '@/services/caseHall';
import { TAppealCaseItem } from '@/services/appealCase';

const MemberList: React.FC = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [recordUserShow, setRecordUserShow] = useState<boolean>(false);

  const currentChooseOrder = useRef<TOrder>();
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  /**
   * 查看正在招募法官的案件
   */
  const { data, refetch } = useCaseHall(['caseHall', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const { mutateAsync } = useJoinJudge({
    onSuccess: () => {
      message.success('加入成功');
      refetch();
    },
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
          onClick={async () => {
            try {
              await mutateAsync({
                orderId: record.orderId,
              });
            } catch (error) {}
          }}
        >
          加入评审团
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
          search={false}
          // search={{
          //   labelWidth: 120,
          // }}
          // @ts-ignore
          request={({ current, pageSize, ...params }: any) => {
            console.log('ppp', params);
            setParams({ ...params, current, size: pageSize });
          }}
          dataSource={data?.records || []}
          toolBarRender={() => [
            // <Button
            //   type="primary"
            //   key="primary"
            //   onClick={() => {
            //     formType.current = 'ADD';
            //     chooseUser.current = undefined;
            //     setFormOpen(true);
            //   }}
            // >
            //   <PlusOutlined /> 新建
            // </Button>,
          ]}
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

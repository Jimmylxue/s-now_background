import { TLetterListParams, TLetterRecordUserParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Input, Popconfirm, Select, message } from 'antd';
import React, { useRef, useState } from 'react';
import { CommitModal } from './components/CommitModal';
import { RecordModal } from './components/RecordModal';
import { useAddUser, useDelUser, useEditUser, useMemberList } from '@/services/member';
import { Sex, TUser, roleConst, sexConst } from '@/services/member/type';
import { baseFormatTime } from '@/utils/time';
import { ERole } from '@/services/login';
import { useExplain, useOrder } from '@/services/order';
import { EOrderStatus, TOrder, orderStatusMap } from '@/services/order/type';

const MemberList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [recordUserShow, setRecordUserShow] = useState<boolean>(false);

  const currentChooseOrder = useRef<TOrder>();
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  const { data, refetch } = useOrder(['order', params], params, {
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

  const { mutateAsync } = useAddUser({
    onSuccess: successCallBack,
  });
  const { mutateAsync: editUser } = useEditUser({
    onSuccess: successCallBack,
  });

  const { mutateAsync: delUser } = useDelUser({
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
      renderFormItem() {
        return <Select options={sexConst} />;
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
          // disabled={orderStatus === EOrderStatus.已申诉}
          onClick={() => {
            currentChooseOrder.current = record;
            setFormOpen(true);
          }}
        >
          申诉
        </Button>,
        // <Button
        //   type="primary"
        //   onClick={() => {
        //     formType.current = 'EDIT';
        //     setFormOpen(true);
        //   }}
        // >
        //   编辑
        // </Button>,
        // <Popconfirm
        //   placement="top"
        //   title={'确定删除吗？'}
        //   okText="Yes"
        //   cancelText="No"
        //   onConfirm={async () => {
        //     await delUser({ id: record.id });
        //   }}
        // >
        //   <Button type="primary">删除</Button>
        // </Popconfirm>,
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

import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { RecordModal } from './components/RecordModal';
import { TPubHallItem, useAddComment, usePubHall } from '@/services/pubHall';
import { CommentModal } from './components/Comment';
import { WriteCommentModal } from './components/Write';

const MemberList: React.FC = () => {
  const [recordShow, setRecordShow] = useState<boolean>(false);
  const [commentShow, setCommentShow] = useState<boolean>(false);
  const [writeShow, setWriteShow] = useState<boolean>(false);

  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  const chooseRecordItem = useRef<TPubHallItem>();

  /**
   * 查看公示的案件
   */
  const { data } = usePubHall(['pubHall', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  const { mutateAsync } = useAddComment({
    onSuccess() {
      message.success('评论成功');
    },
  });

  const columns: ProColumns<TPubHallItem>[] = [
    {
      title: '订单id',
      dataIndex: 'court',
      width: 300,
      render: (val, { court }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className=" ml-2">{court.orderId}</span>
          </div>
        );
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 200,
      renderText: (_, { court }) => court.startTime || '-',
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
            chooseRecordItem.current = record;
            setRecordShow(true);
          }}
        >
          查看材料
        </Button>,
        <Button
          type="primary"
          onClick={async () => {
            chooseRecordItem.current = record;
            setWriteShow(true);
          }}
        >
          评论
        </Button>,
        <Button
          type="primary"
          onClick={async () => {
            chooseRecordItem.current = record;
            setCommentShow(true);
          }}
        >
          查看评论
        </Button>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TPubHallItem, API.PageParams>
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
          dataSource={data?.data?.records || []}
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
        <RecordModal
          recordData={chooseRecordItem.current?.orderExplainMessages}
          open={recordShow}
          onOk={() => {
            setRecordShow(false);
          }}
          onCancel={() => {
            setRecordShow(false);
          }}
        />
        <CommentModal
          orderId={chooseRecordItem.current?.court.orderId}
          open={commentShow}
          onOk={() => {
            setCommentShow(false);
          }}
          onCancel={() => {
            setCommentShow(false);
          }}
        />
        <WriteCommentModal
          open={writeShow}
          onOk={async (values) => {
            await mutateAsync({
              orderId: chooseRecordItem.current?.court?.orderId!,
              text: values.text,
            });
            setWriteShow(false);
          }}
          onCancel={() => {
            setWriteShow(false);
          }}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

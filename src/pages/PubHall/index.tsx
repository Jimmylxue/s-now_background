import {
  useAddLetter,
  useDelLetter,
  useEditLetter,
  useLetterList,
  useSendLetter,
} from '@/services/letter';
import {
  EStatus,
  TLetterItem,
  TLetterListParams,
  TLetterRecordUserParams,
  platformConst,
} from '@/services/letter/type';
import { ProColumns, ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Modal, Popconfirm, Select, Table, message } from 'antd';
import React, { useRef, useState } from 'react';
import { LetterModal } from './components/LetterModal';
import { useForm } from 'antd/es/form/Form';
import { RecordModal } from './components/RecordModal';

const TableList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const chooseLetter = useRef<TLetterItem>();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [commentShow, setCommentShow] = useState<boolean>(false);
  const [sendCommentShow, setSendCommentShow] = useState<boolean>(false);
  const [form] = useForm();

  const [recordUserShow, setRecordUserShow] = useState<boolean>(false);
  const recordUserParams = useRef<TLetterRecordUserParams>();

  const [params, setParams] = useState<TLetterListParams>({
    page: 1,
    pageSize: 10,
  });

  const { data, refetch } = useLetterList(['letterList', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  console.log('data~', data);

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync } = useAddLetter({
    onSuccess: successCallBack,
  });
  const { mutateAsync: editLetter } = useEditLetter({
    onSuccess: successCallBack,
  });

  const { mutateAsync: delLetter } = useDelLetter({
    onSuccess: successCallBack,
  });

  const { mutateAsync: sendLetter } = useSendLetter({
    onSuccess: successCallBack,
  });

  const columns: ProColumns<TLetterItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发送目标平台',
      dataIndex: 'platform',
      renderText: (platform: number) => (platform === 0 ? 'todoList' : 'snowMemo'),
      renderFormItem() {
        return <Select style={{ width: 120 }} options={platformConst} />;
      },
    },
    {
      title: '已读用户数',
      dataIndex: 'hasReadCount',
      render: (val, { letterId }) => {
        return (
          <a
            onClick={() => {
              recordUserParams.current = {
                letterId,
                status: EStatus.已读,
              };
              setRecordUserShow(true);
            }}
          >
            {val}
          </a>
        );
      },
      search: false,
    },
    {
      title: '未读用户数',
      dataIndex: 'notReadCount',
      render: (val, { letterId }) => {
        return (
          <a
            onClick={() => {
              recordUserParams.current = {
                letterId,
                status: EStatus.未读,
              };
              setRecordUserShow(true);
            }}
          >
            {val}
          </a>
        );
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
            chooseLetter.current = record;
            setCommentShow(true);
          }}
        >
          查看评论
        </Button>,

        <Popconfirm
          placement="top"
          title={'确定删除吗？'}
          okText="确定"
          cancelText="取消"
          onConfirm={async () => {
            await delLetter({ letterId: record.letterId });
          }}
        >
          <Button type="primary">删除</Button>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TLetterItem, API.PageParams>
          headerTitle={'公示案件列表'}
          key={'letterId'}
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
            setParams({ ...params, page: current, pageSize });
          }}
          dataSource={data?.result || []}
          columns={columns}
        />
        <LetterModal
          type="ADD"
          letter={chooseLetter.current}
          onOk={async (values) => {
            if (formType.current === 'ADD') {
              await mutateAsync(values);
            } else {
              await editLetter({ ...values, letterId: chooseLetter.current?.letterId });
            }

            setFormOpen(false);
          }}
          onCancel={() => {
            setFormOpen(false);
          }}
          open={formOpen}
        />
        {/* <Modal title={'评论区'} width="700px" open={sendShow}> */}
        <Modal
          title={'评论区'}
          width="700px"
          open={commentShow}
          onCancel={() => {
            setCommentShow(false);
          }}
        >
          <div className="flex justify-end mb-2">
            <Button
              type="primary"
              onClick={() => {
                setSendCommentShow(true);
              }}
            >
              我也说两句
            </Button>
          </div>
          <Table
            dataSource={[
              {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
              },
              {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
              },
            ]}
            columns={[
              {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
              },
              {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
              },
            ]}
          />
        </Modal>

        <ModalForm
          form={form}
          title={'发起评论'}
          width="400px"
          open={sendCommentShow}
          onOpenChange={(status) => {
            form.resetFields();
            if (status === false) {
              setSendCommentShow(false);
            }
          }}
          onFinish={async (value) => {
            const userIds = value.userIds.split('|').map(Number);
            await sendLetter({
              letterId: chooseLetter.current?.letterId!,
              userIds,
            });
            setSendCommentShow(false);
          }}
        >
          <ProFormTextArea
            rules={[
              {
                required: true,
                message: '请输入评论内容',
              },
            ]}
            width="md"
            name="userIds"
            placeholder="请输入评论内容"
          />
        </ModalForm>
        <RecordModal
          params={recordUserParams.current}
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
export default TableList;

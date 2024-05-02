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
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Popconfirm, Select, message } from 'antd';
import React, { useRef, useState } from 'react';
import { LetterModal } from './components/LetterModal';
import { useForm } from 'antd/es/form/Form';
import { RecordModal } from './components/RecordModal';

const TableList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const chooseLetter = useRef<TLetterItem>();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [sendShow, setSendShow] = useState<boolean>(false);
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
      tip: 'The rule name is the unique key',
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
        <a
          onClick={() => {
            chooseLetter.current = record;
            setSendShow(true);
          }}
        >
          发布
        </a>,
        <a
          onClick={() => {
            formType.current = 'EDIT';
            chooseLetter.current = record;
            setFormOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          placement="top"
          title={'确定删除吗？'}
          okText="Yes"
          cancelText="No"
          onConfirm={async () => {
            await delLetter({ letterId: record.letterId });
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TLetterItem, API.PageParams>
          headerTitle={'案件列表'}
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
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                formType.current = 'ADD';
                chooseLetter.current = undefined;
                setFormOpen(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
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
        <ModalForm
          form={form}
          title={'新建规则'}
          width="400px"
          open={sendShow}
          onOpenChange={(status) => {
            form.resetFields();
            if (status === false) {
              setSendShow(false);
            }
          }}
          onFinish={async (value) => {
            const userIds = value.userIds.split('|').map(Number);
            await sendLetter({
              letterId: chooseLetter.current?.letterId!,
              userIds,
            });
            setSendShow(false);
          }}
        >
          <ProFormTextArea
            rules={[
              {
                required: true,
                message: '用户id为必填项',
              },
            ]}
            width="md"
            name="userIds"
            placeholder="请输入用户id，并使用|隔开"
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

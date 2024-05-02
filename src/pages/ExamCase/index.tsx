import { useDelLetter, useLetterList } from '@/services/letter';
import {
  EStatus,
  TLetterItem,
  TLetterListParams,
  TLetterRecordUserParams,
  platformConst,
} from '@/services/letter/type';
import { UploadOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Popconfirm, Select, Upload, message } from 'antd';
import React, { useRef, useState } from 'react';
import { UploadProps } from 'antd/lib';

const TableList: React.FC = () => {
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

  const { mutateAsync: delLetter } = useDelLetter({
    onSuccess: successCallBack,
  });

  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
          headerTitle={'题库列表'}
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
          request={refetch}
          dataSource={data?.result || []}
          toolBarRender={() => [
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>上传题库</Button>
            </Upload>,
          ]}
          columns={columns}
        />
      </PageContainer>
    </>
  );
};
export default TableList;

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
import {
  TQuestionItem,
  useAddQuestionItem,
  useDelQuestionItem,
  useExamQuestionList,
  useJudgeExam,
} from '@/services/exam';
import { AddModal } from './components/LetterModal';

const TableList: React.FC = () => {
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  const [addShow, setAddShow] = useState<boolean>(false);

  const { data, refetch } = useExamQuestionList(['questionList', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  console.log('data~', data);

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync: delQuestion } = useDelQuestionItem({
    onSuccess: successCallBack,
  });

  const { mutateAsync: addQuestion } = useAddQuestionItem({
    onSuccess: successCallBack,
  });

  const props: UploadProps = {
    name: 'file',
    action: 'http://175.178.248.238:8080/api/question/excel',
    headers: {
      authorization: localStorage.getItem('token')!,
    },
    maxCount: 1,
    beforeUpload(file: any) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        message.error('You can only upload xlsx file!');
        return;
      }
      console.log('fileType', file.type);
      return true;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const filePath = info.file.response.data;
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns: ProColumns<TQuestionItem>[] = [
    {
      title: '题目',
      dataIndex: 'questionText',
      width: 400,
    },
    {
      title: '选项A',
      dataIndex: 'optionA',
    },
    {
      title: '选项B',
      dataIndex: 'optionB',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '正确答案',
      dataIndex: 'answer',
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
            await delQuestion({ id: record.id });
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
        <ProTable<TQuestionItem, API.PageParams>
          headerTitle={'题库列表'}
          key={'letterId'}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.current,
            pageSize: params.size,
            onChange: (pageNum, pageSize) => {
              setParams({ ...params, current: pageNum, size: pageSize });
            },
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
          // @ts-ignore
          dataSource={data?.records || []}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setAddShow(true);
              }}
            >
              添加题目
            </Button>,
          ]}
          columns={columns}
        />
      </PageContainer>
      <AddModal
        open={addShow}
        onOk={async (values) => {
          await addQuestion(values);
          setAddShow(false);
        }}
        onCancel={() => {
          setAddShow(false);
        }}
      />
    </>
  );
};
export default TableList;

import { useLetterRecordUserList } from '@/services/letter';
import { TLetterItem, TLetterRecordUserParams, TUser, platformConst } from '@/services/letter/type';
import { Sex, TLoginUser } from '@/services/login';
import { useJudgeCatQuery } from '@/services/myCase';
import { TPubHallItem } from '@/services/pubHall';
import { Button, Form, Image, Input, Modal, Select, Space, Table, TableProps, Tag } from 'antd';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  orderId?: string;
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function RecordModal({ orderId, open, onOk, onCancel }: TProps) {
  const { data, refetch } = useJudgeCatQuery(
    ['explainQuery'],
    { orderId: orderId! },
    {
      enabled: !!orderId,
      refetchOnWindowFocus: false,
    },
  );

  console.log('data', data);

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  const columns: TableProps<TPubHallItem['orderExplainMessages']['0']>['columns'] = [
    {
      title: '用户id',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '补充文案',
      dataIndex: 'userText',
      key: 'userText',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          onClick={async () => {
            try {
              // await mutateAsync({
              //   orderId: record.orderId,
              // });
            } catch (error) {}
          }}
        >
          下载资料
        </Button>,
      ],
    },
  ];

  return (
    <Modal title={'证据列表'} open={open} onOk={onOk} onCancel={onCancel}>
      {Object.values(data?.data || {})?.map((data) => (
        <Table columns={columns} dataSource={data as any} />
      ))}
    </Modal>
  );
}

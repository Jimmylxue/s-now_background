import { useLetterRecordUserList } from '@/services/letter';
import { TLetterItem, TLetterRecordUserParams, TUser, platformConst } from '@/services/letter/type';
import { Sex, TLoginUser } from '@/services/login';
import { TLetterListParams } from '@/services/member/type';
import { useDelComment, usePubComment } from '@/services/pubHall';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  orderId?: string;
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function CommentModal({ orderId, open, onOk, onCancel }: TProps) {
  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
    orderId,
  });

  useEffect(() => {
    setParams((cur) => ({ ...cur, orderId }));
  }, [orderId]);

  const { data, refetch } = usePubComment(['pubHall', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const { mutateAsync } = useDelComment({
    onSuccess() {
      message.success('删除成功');
      refetch();
    },
  });

  useEffect(() => {
    if (open && params.orderId) {
      refetch();
    }
  }, [open, params]);

  console.log('userList', data);

  const columns: TableProps<TUser>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '评论内容',
      dataIndex: 'userComment',
      key: 'userComment',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 200,
      render: (_, record) => [
        <Button
          type="primary"
          onClick={async () => {
            await mutateAsync({ id: record.id });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <Modal title={'用户列表'} open={open} onOk={onOk} onCancel={onCancel}>
      <Table
        columns={columns}
        dataSource={data?.records || ([] as any)}
        pagination={{
          showTotal: (total: number) => `共有${total}条记录`,
          total: data?.total,
          current: params.current,
          pageSize: params.size,
          onChange: (pageNum, pageSize) =>
            setParams({ ...params, current: pageNum, size: pageSize }),
        }}
      />
    </Modal>
  );
}

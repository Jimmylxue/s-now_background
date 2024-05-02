import { useLetterRecordUserList } from '@/services/letter';
import { TLetterItem, TLetterRecordUserParams, TUser, platformConst } from '@/services/letter/type';
import { Sex, TLoginUser } from '@/services/login';
import { Form, Image, Input, Modal, Select, Space, Table, TableProps, Tag } from 'antd';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  params?: TLetterRecordUserParams;
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function RecordModal({ params = { letterId: 0, status: 1 }, open, onOk, onCancel }: TProps) {
  const [form] = Form.useForm();

  const { data: userList, refetch } = useLetterRecordUserList(['recordUser'], params, {
    enabled: !!params?.letterId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  console.log('userList', userList);

  const columns: TableProps<TUser>['columns'] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (url) => <Image width="30px" height="30px" src={url} />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (val) => <span>{val === Sex.男 ? '男' : val === Sex.女 ? '女' : '-'}</span>,
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
      key: 'mail',
    },
  ];

  return (
    <Modal title={'用户列表'} open={open} onOk={onOk} onCancel={onCancel}>
      <Table columns={columns} dataSource={userList as any} />
    </Modal>
  );
}

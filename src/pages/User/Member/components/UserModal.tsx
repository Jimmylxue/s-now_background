import { TLetterItem } from '@/services/letter/type';
import { Sex, TUser } from '@/services/member/type';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  type: 'ADD' | 'EDIT';
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  user?: TUser;
};

export function UserModal({ open, onOk, onCancel, type, user }: TProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user]);

  return (
    <Modal
      title={type === 'ADD' ? '添加用户' : '编辑用户'}
      open={open}
      onOk={form.submit}
      onCancel={onCancel}
    >
      <Form
        form={form}
        onFinish={(values) => {
          onOk(values);
        }}
        labelCol={{ span: 4 }}
      >
        <Form.Item name="username" label="昵称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sex" label="性别">
          <Select
            defaultValue={Sex.未知}
            style={{ width: 120 }}
            options={[
              { value: Sex.未知, label: '-' },
              { value: Sex.男, label: '男' },
              { value: Sex.女, label: '女' },
            ]}
          />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

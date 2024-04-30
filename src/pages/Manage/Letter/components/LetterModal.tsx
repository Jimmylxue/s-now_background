import { TLetterItem, platformConst } from '@/services/letter/type';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  type: 'ADD' | 'EDIT';
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  letter?: TLetterItem;
};

export function LetterModal({ open, onOk, onCancel, type, letter }: TProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (letter) {
      form.setFieldsValue(letter);
    } else {
      form.resetFields();
    }
  }, [letter]);

  return (
    <Modal
      title={type === 'ADD' ? '添加站内信' : '编辑站内信'}
      open={open}
      onOk={form.submit}
      onCancel={onCancel}
    >
      <Form
        form={form}
        onFinish={(values) => {
          console.log('values~', values);
          onOk(values);
        }}
      >
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
          <Select style={{ width: 120 }} options={platformConst} />
        </Form.Item>
        <Form.Item name="content" label="内容" rules={[{ required: true }]}>
          <ReactQuill theme="snow" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

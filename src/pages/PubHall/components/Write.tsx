import { TLetterItem, platformConst } from '@/services/letter/type';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function WriteCommentModal({ open, onOk, onCancel }: TProps) {
  const [form] = Form.useForm();

  return (
    <Modal title={'发布评论'} open={open} onOk={form.submit} onCancel={onCancel}>
      <Form
        form={form}
        onFinish={(values) => {
          console.log('values~', values);
          onOk(values);
        }}
      >
        <Form.Item name="text" label="评论内容" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

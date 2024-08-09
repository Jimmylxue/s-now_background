import { TConfigItem } from '@/services/address';
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  config?: TConfigItem;
};

export function SettingModal({ open, onOk, onCancel, config }: TProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (config) {
      form.setFieldsValue(config);
    } else {
      form.resetFields();
    }
  }, [config]);

  return (
    <Modal title={'修改配置'} open={open} onOk={form.submit} onCancel={onCancel}>
      <Form
        form={form}
        onFinish={(values) => {
          onOk(values);
        }}
        labelCol={{ span: 4 }}
      >
        <Form.Item name="lineCode" label="LINE" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="inviteCode" label="邀请链接" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

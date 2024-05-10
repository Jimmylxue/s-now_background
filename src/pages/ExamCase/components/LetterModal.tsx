import { Form, Input, Modal, Select } from 'antd';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function AddModal({ open, onOk, onCancel }: TProps) {
  const [form] = Form.useForm();

  return (
    <Modal title="添加题目" open={open} onOk={form.submit} onCancel={onCancel}>
      <Form
        form={form}
        onFinish={(values) => {
          console.log('values~', values);
          onOk(values);
        }}
        labelCol={{
          span: 4,
        }}
      >
        <Form.Item name="questionText" label="标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
          <Select
            style={{ width: 120 }}
            options={[
              { value: '选择', label: '选择' },
              { value: '判断', label: '判断' },
            ]}
          />
        </Form.Item>
        <Form.Item name="optionA" label="选项A" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="optionB" label="选项B" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="answer" label="答案" rules={[{ required: true }]}>
          <Select
            style={{ width: 120 }}
            options={[
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

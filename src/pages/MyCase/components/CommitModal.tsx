import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Select, Upload, message } from 'antd';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function CommitModal({ open, onOk, onCancel }: TProps) {
  const [form] = Form.useForm();

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.file?.response?.data;
  };

  return (
    <Modal title={'上传资料'} open={open} onOk={form.submit} onCancel={onCancel}>
      <Form
        form={form}
        onFinish={(values) => {
          onOk(values);
        }}
        labelCol={{ span: 4 }}
      >
        <Form.Item name="userText" label="文案" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Upload"
          name="filePath"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload
            action="http://175.178.248.238:8080/api/upload"
            headers={{
              authorization: localStorage.getItem('token')!,
            }}
            beforeUpload={() => {
              return true;
            }}
            maxCount={1}
          >
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

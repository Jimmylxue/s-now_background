import { Uploader } from '@/components/Uploader';
import { TProductTypeItem } from '@/services/shop/productType';
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  type: 'ADD' | 'EDIT';
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  selectItem?: TProductTypeItem;
};

export function ProductTypeModal({ open, onOk, onCancel, type, selectItem }: TProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectItem) {
      const { imgSrc, ...args } = selectItem;
      form.setFieldsValue({ ...args, imgSrc: [imgSrc] });
    } else {
      form.resetFields();
    }
  }, [selectItem]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.file?.response?.data;
  };

  return (
    <Modal
      title={type === 'ADD' ? '添加分类' : '编辑分类'}
      open={open}
      onOk={form.submit}
      onCancel={onCancel}
    >
      <Form
        labelCol={{
          span: 4,
        }}
        form={form}
        onFinish={(values) => {
          onOk(values);
        }}
      >
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="subTitle" label="副标题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="desc" label="描述" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="图片"
          name="imgSrc"
          rules={[{ required: true }]}
          getValueFromEvent={normFile}
        >
          <Uploader accept=".jpg,.png,.gif" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

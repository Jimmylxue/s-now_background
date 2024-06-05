import { Uploader } from '@/components/Uploader';
import { EProductStatusConst, ESaleStatusConst, TProductItem } from '@/services/shop/product';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  type: 'ADD' | 'EDIT';
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  selectItem?: TProductItem;
  productTypeMap: {
    label: string;
    value: number;
  }[];
};

export function ProductModal({ open, onOk, onCancel, type, selectItem, productTypeMap }: TProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectItem) {
      const { imgSrc, videoSrc, ...args } = selectItem;
      form.setFieldsValue({ ...args, imgSrc: imgSrc?.split('@') || [], videoSrc: [videoSrc] });
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
      title={type === 'ADD' ? '添加商品' : '编辑商品'}
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
          <Input style={{ width: 350 }} />
        </Form.Item>
        <Form.Item name="subTitle" label="副标题" rules={[{ required: true }]}>
          <Input style={{ width: 350 }} />
        </Form.Item>
        <Form.Item name="desc" label="描述" rules={[{ required: true }]}>
          <Input style={{ width: 350 }} />
        </Form.Item>
        <Form.Item name="productTypeId" label="所属分类" rules={[{ required: true }]}>
          <Select options={productTypeMap} style={{ width: 350 }} />
        </Form.Item>
        <Form.Item name="price" label="金额" rules={[{ required: true }]}>
          <InputNumber style={{ width: 350 }} />
        </Form.Item>
        <Form.Item name="saleStatue" label="上架状态" rules={[{ required: true }]}>
          <Select options={ESaleStatusConst} style={{ width: 350 }} />
        </Form.Item>
        <Form.Item name="status" label="库存状态" rules={[{ required: true }]}>
          <Select options={EProductStatusConst} style={{ width: 350 }} />
        </Form.Item>
        <Form.Item
          label="图片"
          name="imgSrc"
          rules={[{ required: true }]}
          getValueFromEvent={normFile}
          extra="第一张图为主图"
        >
          <Uploader maxCount={10} accept=".jpg,.png,.gif" multiple />
        </Form.Item>
        <Form.Item
          label="视频"
          name="videoSrc"
          rules={[{ required: true }]}
          getValueFromEvent={normFile}
          extra="第一张图为主图"
        >
          <Uploader maxCount={10} accept=".jpg,.png,.gif" multiple />
        </Form.Item>
      </Form>
    </Modal>
  );
}

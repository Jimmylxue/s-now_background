import { isSuccessResponse } from '@/utils/utils';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Modal, Spin, Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/lib';
import { ReactNode, useEffect, useState } from 'react';
import { compact } from 'lodash';
import './index.less';

const getBase64 = (file: File | Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface IUploadProps extends Omit<UploadProps, 'onChange'> {
  limitSize?: number;
  uploading?: boolean;
  setUploading?: (value: boolean) => void; // 多张图片的情况下，记得要设置setUploading
  isSingle?: boolean;
  resetValue?: string[] | string;
  value?: string[] | string;
  additionalData?: any;
  onChange?: (values: string[] | string) => void;
  children?: ReactNode;
  fileName?: string;
}
export function Uploader({
  maxCount = 1,
  children,
  uploading = false,
  setUploading,
  value,
  onChange,
  isSingle,
  accept,
  multiple,
}: IUploadProps) {
  const [previewObj, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  });

  const [fileList, setFileList] = useState<Pick<UploadFile, 'uid' | 'status' | 'url'>[]>([]);

  useEffect(() => {
    if (typeof value === 'string' && isSingle) {
      return setFileList([{ uid: '1', status: 'done', url: value }]);
    }
    if (Array.isArray(value) && value.length) {
      setFileList(() => {
        return value.map((url, idx) => ({
          uid: String(idx + 1),
          name: String(idx + 1),
          status: 'done',
          url,
        }));
      });
    }
    if (value === undefined) {
      setFileList([]);
    }
  }, [value]);

  const handleChange = ({ fileList }: UploadChangeParam) => {
    let batchLoading = false;
    fileList.forEach((item, idx) => {
      const { status, response } = item;
      if (!status) {
        fileList[idx] = { ...item, status: 'error' };
      }

      if (status === 'uploading') batchLoading = true;
      if (status === 'done' && response) {
        if (!isSuccessResponse(response)) {
          fileList[idx] = {
            ...item,
            status: 'error',
            response: response.msg,
          };
          return;
        }
        fileList[idx] = {
          ...item,
          status: response.result ? 'done' : 'error',
          url: response.result,
        };
      }
    });

    setUploading && setUploading(batchLoading);
    setFileList(fileList as any);
    if (!batchLoading) {
      const list = compact(fileList.map((file) => file.url));
      onChange && onChange(isSingle ? list[0] : list);
    }
  };

  const handleCancel = () => {
    setPreview({ ...previewObj, previewVisible: false });
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file!.originFileObj!)) as string;
    }
    setPreview({
      previewImage: (file.url || file.preview) as string,
      previewVisible: true,
      previewTitle: file.name || '图片预览',
    });
  };

  return (
    <div>
      <Upload
        multiple={multiple}
        accept={accept}
        action="https://api.jimmyxuexue.top/upload"
        headers={{
          authorization: 'Bearer ' + localStorage.getItem('token')!,
        }}
        beforeUpload={() => {
          return true;
        }}
        fileList={fileList as any}
        maxCount={maxCount}
        itemRender={(originNode, file, currFileList) => {
          console.log('fff', file, currFileList);
          return <img className="size-[100px] mr-2" src={file?.url} />;
        }}
        onPreview={handlePreview}
        onChange={handleChange}
        className="dz-upload"
      >
        {fileList.length >= maxCount
          ? null
          : children || (
              <div>
                <Spin spinning={uploading}>
                  <CloudUploadOutlined />
                  <div> 点击上传</div>
                </Spin>
              </div>
            )}
      </Upload>
      <Modal
        visible={previewObj.previewVisible}
        title={previewObj.previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewObj.previewImage} />
      </Modal>
    </div>
  );
}

import { useGenerateLink } from '@/services/address';
import { copyToClipboard } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Modal } from 'antd';
import React from 'react';

const TempLinkPage: React.FC = () => {
  const { isLoading, mutateAsync } = useGenerateLink({
    onSuccess: (res) => {
      Modal.confirm({
        title: '临时链接生成成功',
        content: (
          <div>
            <div>{res}</div>
            <Button
              type="primary"
              className=" mt-2"
              onClick={() => {
                copyToClipboard(res);
                message.success('复制成功');
              }}
            >
              复制
            </Button>
          </div>
        ),
      });
    },
  });

  return (
    <>
      <PageContainer>
        <div className=" w-full flex justify-center items-center">
          <Button
            type="primary"
            size="large"
            className=" mt-5"
            loading={isLoading}
            onClick={async () => {
              await mutateAsync({});
            }}
          >
            生成链接
          </Button>
        </div>
      </PageContainer>
    </>
  );
};
export default TempLinkPage;

import { TLetterListParams } from '@/services/letter/type';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import React, { useRef, useState } from 'react';
import { TConfigItem, useEditConfig, useSystemConfig } from '@/services/address';
import { Button, message } from 'antd';
import { SettingModal } from './components/settingModal';

const MemberList: React.FC = () => {
  const { data, refetch } = useSystemConfig(
    ['system-config'],
    {},
    {
      onSuccess: () => {},
      refetchOnWindowFocus: false,
    },
  );

  const [formOpen, setFormOpen] = useState<boolean>(false);

  const chooseConfig = useRef<TConfigItem>();

  const { mutateAsync } = useEditConfig({
    onSuccess: () => {
      message.success('操作成功');
      setFormOpen(false);
      refetch();
    },
  });

  const columns: ProColumns<TConfigItem>[] = [
    {
      title: '邀请链接',
      dataIndex: 'inviteCode',
    },
    {
      title: 'LINE',
      dataIndex: 'lineCode',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <Button
          type="primary"
          onClick={() => {
            chooseConfig.current = record;
            setFormOpen(true);
          }}
        >
          修改
        </Button>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TConfigItem, API.PageParams>
          headerTitle={'系统配置'}
          key={'configId'}
          pagination={false}
          search={false}
          // @ts-ignore
          request={() => {
            refetch();
          }}
          dataSource={data?.result || []}
          columns={columns}
        />
        <SettingModal
          open={formOpen}
          config={chooseConfig.current}
          onCancel={() => {
            setFormOpen(false);
          }}
          onOk={(value) => {
            console.log('value', value);
            mutateAsync(value);
          }}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

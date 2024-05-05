import { TLetterListParams, TLetterRecordUserParams } from '@/services/letter/type';
import { PlusOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Input, Popconfirm, Select, message } from 'antd';
import React, { useRef, useState } from 'react';
import { UserModal } from './components/UserModal';
import { RecordModal } from './components/RecordModal';
import { useAddUser, useDelUser, useEditUser, useMemberList } from '@/services/member';
import { Sex, roleConst, sexConst } from '@/services/member/type';
import { baseFormatTime } from '@/utils/time';
import { ERole, TLoginUser } from '@/services/login';

const MemberList: React.FC = () => {
  const formType = useRef<'ADD' | 'EDIT'>('ADD');
  const chooseUser = useRef<TLoginUser>();
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [recordUserShow, setRecordUserShow] = useState<boolean>(false);
  const recordUserParams = useRef<TLetterRecordUserParams>();

  const [params, setParams] = useState<TLetterListParams>({
    current: 1,
    size: 10,
  });

  const { data, refetch } = useMemberList(['member', params], params, {
    onSuccess: () => {},
    refetchOnWindowFocus: false,
  });

  console.log('data~', data);

  const successCallBack = () => {
    message.success('操作成功');
    refetch();
  };

  const { mutateAsync } = useAddUser({
    onSuccess: successCallBack,
  });
  const { mutateAsync: editUser } = useEditUser({
    onSuccess: successCallBack,
  });

  const { mutateAsync: delUser } = useDelUser({
    onSuccess: successCallBack,
  });

  const columns: ProColumns<TLoginUser>[] = [
    {
      title: '用户',
      dataIndex: 'username',
      width: 300,
      render: (_, { username }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className=" ml-2">{username}</span>
          </div>
        );
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      renderText: (_, { sex }) => (sex === Sex.男 ? '男' : sex === Sex.女 ? '女' : '-'),
      renderFormItem() {
        return <Select options={sexConst} />;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
      renderText: (mail) => mail || '-',
      renderFormItem() {
        return <Input />;
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 150,
      renderText: (phone) => phone || '-',
      renderFormItem() {
        return <Input />;
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 80,
      renderText: (_, { role }) => {
        const _role = role;
        if (_role === ERole.管理员) {
          return '管理员';
        } else if (_role === ERole.法官) {
          return '法官';
        } else if (_role === ERole.买家) {
          return '买家';
        } else if (_role === ERole.卖家) {
          return '卖家';
        } else {
          return '-';
        }
      },
      renderFormItem() {
        return <Select options={roleConst} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          onClick={() => {
            formType.current = 'EDIT';
            chooseUser.current = record;
            setFormOpen(true);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          placement="top"
          title={'确定删除吗？'}
          okText="Yes"
          cancelText="No"
          onConfirm={async () => {
            await delUser({ id: record.id! });
          }}
        >
          <Button type="primary">删除</Button>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <PageContainer>
        <ProTable<TLoginUser, API.PageParams>
          headerTitle={'用户列表'}
          key={'id'}
          pagination={{
            showTotal: (total: number) => `共有${total}条记录`,
            total: data?.total,
            current: params.current,
            pageSize: params.size,
            onChange: (pageNum, pageSize) =>
              setParams({ ...params, current: pageNum, size: pageSize }),
          }}
          search={{
            labelWidth: 120,
          }}
          // @ts-ignore
          request={({ current, pageSize, ...params }: any) => {
            console.log('ppp', params);
            setParams({ ...params, current, size: pageSize });
          }}
          dataSource={data?.records || []}
          toolBarRender={() => [
            // <Button
            //   type="primary"
            //   key="primary"
            //   onClick={() => {
            //     formType.current = 'ADD';
            //     chooseUser.current = undefined;
            //     setFormOpen(true);
            //   }}
            // >
            //   <PlusOutlined /> 新建
            // </Button>,
          ]}
          columns={columns}
        />
        <UserModal
          type="ADD"
          user={chooseUser.current}
          onOk={async (values) => {
            if (formType.current === 'ADD') {
              await mutateAsync({ ...values, password: btoa(values.password) });
            } else {
              await editUser({ ...values, id: chooseUser.current?.id });
            }

            setFormOpen(false);
          }}
          onCancel={() => {
            setFormOpen(false);
          }}
          open={formOpen}
        />
        <RecordModal
          params={recordUserParams.current}
          open={recordUserShow}
          onOk={() => {
            setRecordUserShow(false);
          }}
          onCancel={() => {
            setRecordUserShow(false);
          }}
        />
      </PageContainer>
    </>
  );
};
export default MemberList;

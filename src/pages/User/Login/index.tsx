import { Footer } from '@/components';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { history, useModel, Helmet } from '@umijs/max';
import { Form, message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import { encrypt } from '@/utils';
import { Role, login, register } from '@/services/login';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Login: React.FC = () => {
  const [type, setType] = useState<string>('login');
  const { setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const handleSubmit = async (values: any) => {
    if (type === 'login') {
      // 登录
      values.password = await encrypt(values.password);
      const res = (await login({
        ...values,
      })) as any;
      localStorage.setItem('token', res.token);
      localStorage.setItem('login-user', JSON.stringify(res.user));
      message.success('登录成功');
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: res.user,
        }));
      });
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    } else {
      // 注册
      const { username, phone, password, confirmPassword } = values;
      if (password !== confirmPassword) {
        message.error('两次密码输入不一致');
        return;
      }

      try {
        await register({
          username,
          phone,
          password: btoa(password + 'snow-todoList'),
          role: Role.管理员,
        });

        message.success('注册成功~');
        setType('login');
      } catch (error) {}
    }
  };
  // const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          form={form}
          submitter={{
            searchConfig: {
              submitText: type === 'login' ? '登录' : '注册',
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          initialValues={{
            autoLogin: true,
          }}
          // actions={['其他登录方式 :', <ActionIcons key="icons" />]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={(key) => {
              form.resetFields();
              setType(key);
            }}
            centered
            items={[
              {
                key: 'login',
                label: '登录',
              },
              {
                key: 'register',
                label: '注册',
              },
            ]}
          />

          {type === 'login' && (
            <>
              <ProFormText
                name="phone"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项！',
                  },
                ]}
              />

              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}

          {type === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="username"
                placeholder={'请输入手机号！'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项',
                  },
                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="phone"
                placeholder={'请输入手机号！'}
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项',
                  },
                ]}
              />
              {/* <ProFormSelect
                name="role"
                options={[
                  { value: 1, label: '管理员' },
                  { value: 2, label: '法官' },
                  { value: 3, label: '买家' },
                  { value: 4, label: '卖家' },
                ]}
                placeholder={'请选择角色'}
                rules={[
                  {
                    required: true,
                    message: '必须选择一个角色',
                  },
                ]}
              /> */}
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次确认密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;

export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  // {
  //   path: '/member',
  //   name: '会员管理',
  //   icon: 'crown',
  //   component: './User/Member',
  // },
  {
    path: '/address',
    name: '地址管理',
    icon: 'crown',
    component: './Address/index',
  },
  {
    path: '/config',
    name: '系统设置',
    icon: 'SettingOutlined',
    component: './Address/config',
  },
  {
    path: '/tempLink',
    name: '临时链接',
    icon: 'SettingOutlined',
    component: './TempLink',
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];

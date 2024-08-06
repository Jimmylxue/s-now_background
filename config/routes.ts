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
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];

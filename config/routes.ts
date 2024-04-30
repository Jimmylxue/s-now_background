export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  {
    path: '/manage',
    name: '系统管理',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
      { path: '/manage', redirect: '/admin/letter' },
      {
        path: '/manage/letter',
        name: '站内信',
        hideChildrenInMenu: true,
        component: './Manage/Letter',
      },
    ],
  },
  {
    path: '/member',
    name: '会员管理',
    icon: 'crown',
    component: './User/Member',
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];

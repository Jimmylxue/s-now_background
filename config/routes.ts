/**
 * 配置查看 https://umijs.org/docs/max/layout-menu#hideinxxx
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  /**
   * 法官相关
   */
  {
    path: '/chooseRole',
    menuRender: false,
    hideInMenu: true,
    name: '角色选择',
    icon: 'smile',
    component: './ChooseRole',
  },
  {
    path: '/exam',
    name: '考试答题',
    icon: 'experimentOutlined',
    component: './Exam',
    access: 'isJudge',
  },
  // 用户法官进行接单
  {
    path: '/caseHall',
    name: '案件大厅',
    icon: 'smile',
    component: './CaseHall',
    access: 'isJudge',
  },
  {
    path: '/myCase',
    name: '我的案件',
    icon: 'smile',
    component: './MyCase',
    access: 'hasMyCase',
  },

  /**
   * 卖家买家
   */
  {
    path: '/order',
    name: '我的订单',
    icon: 'smile',
    component: './Order',
    access: 'isUser',
  },

  {
    path: '/user/member',
    name: '用户管理',
    icon: 'smile',
    component: './User/Member',
    access: 'isAdmin',
  },
  {
    path: '/examCase',
    name: '考试题目管理',
    icon: 'smile',
    component: './ExamCase',
    access: 'isAdmin',
  },
  {
    path: '/appealCase',
    name: '申诉案件管理',
    icon: 'smile',
    component: './AppealCase',
    access: 'isAdmin',
  },
  // 历史案件管理就是公式大厅
  // {
  //   path: '/caseHistory',
  //   name: '历史案件管理',
  //   icon: 'smile',
  //   component: './CaseHistory',
  //   access: 'isAdmin',
  // },

  {
    path: '/pubHall',
    name: '公示大厅',
    icon: 'smile',
    component: './PubHall',
  },

  // {
  //   path: '/admin',
  //   name: '管理页',
  //   icon: 'crown',
  //   // 权限通过 src/access.ts 模块进行判断
  //   access: 'canAdmin',
  //   routes: [
  //     { path: '/admin', redirect: '/admin/sub-page' },
  //     { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
  //   ],
  // },
  // {
  //   path: '/manage',
  //   name: '系统管理',
  //   icon: 'crown',
  //   // access: 'canAdmin',
  //   routes: [
  //     { path: '/manage', redirect: '/admin/letter' },
  //     {
  //       path: '/manage/letter',
  //       name: '站内信',
  //       component: './Manage/Letter',
  //     },
  //   ],
  // },
  // {
  //   path: '/member',
  //   name: '会员管理',
  //   icon: 'crown',
  //   component: './User/Member',
  // },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];

export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
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
        component: './Manage/Letter',
      },
    ],
  },
  {
    path: '/shop',
    name: '商城管理',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
      { path: '/shop', redirect: '/shop/productType' },
      {
        path: '/shop/productType',
        name: '商品类型',
        component: './Shop/ProductType',
      },
      {
        path: '/shop/product',
        name: '商品',
        component: './Shop/Product',
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

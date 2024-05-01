/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('test', currentUser && currentUser.access === 'admin');
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    adminRouteFilter: () => true, // 只有管理员可访问
  };
}

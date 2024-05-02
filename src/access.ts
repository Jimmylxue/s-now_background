/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  const role: 'admin' | 'judge' | 'user' = 'user';
  console.log('test', currentUser && currentUser.access === 'admin');
  return {
    isAdmin: role === 'admin',
    isJudge: role === 'judge',
    isUser: role === 'user',
    /**
     * 是否拥有 我的案件 入口
     */
    hasMyCase: ['judge', 'user'].includes(role),
  };
}

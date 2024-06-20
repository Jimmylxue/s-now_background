import { Role, TLoginUser } from './services/login';

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: TLoginUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('test', currentUser);
  return {
    isAdmin: currentUser && currentUser.role === Role.管理员,
    isNormalUser: currentUser && currentUser.role === Role.普通用户,
    isUnSet: currentUser && currentUser.role === Role.未定义,
    adminRouteFilter: () => true, // 只有管理员可访问
  };
}

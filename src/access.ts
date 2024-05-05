import { ERole, TLoginUser } from './services/login';

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: TLoginUser } | undefined) {
  const { currentUser } = initialState ?? {};
  const role = currentUser?.role;
  const isUser = [ERole.买家, ERole.卖家].includes(role);
  return {
    isAdmin: role === ERole.管理员,
    isJudge: role === ERole.法官,
    isUser,
    /**
     * 是否拥有 我的案件 入口
     */
    hasMyCase: [ERole.买家, ERole.卖家, ERole.法官].includes(role!),
  };
}

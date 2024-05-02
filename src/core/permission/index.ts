import { useModel } from '@umijs/max';

export function usePermission() {
  const { initialState } = useModel('@@initialState');

  const user = initialState?.currentUser;

  const isAdmin = true;
  const isJudge = true;
  const isUser = true;

  return { isAdmin, isJudge, isUser };
}

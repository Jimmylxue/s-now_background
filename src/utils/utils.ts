import { message } from 'antd';

type IResponse<T = any> = {
  code: 200 | 500 | 401 | 600;
  msg?: string;
  result: T;
};

export function isSuccessResponse(response: IResponse<any>, defaultMsg?: string) {
  if (!response) {
    message.error(defaultMsg);
    return false;
  }
  if (response.code !== 200) {
    message.error(response.msg);
    return false;
  }
  return true;
}

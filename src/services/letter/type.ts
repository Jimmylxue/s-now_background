import { TPageListType } from '../type';

export const platformConst = [
  {
    label: 'TodoList',
    value: 0,
  },
  {
    label: 'SnowMemo',
    value: 1,
  },
];

export enum EPlatform {
  todoList,
  snowMemo,
}

export enum EStatus {
  未读 = 1,
  已读,
}

export type TLetterItem = {
  letterId: number;
  platform: EPlatform;
  title: string;
  content: string;
  hasReadCount: number;
  notReadCount: number;
  createdTime: Date;
  updateTime: Date;
};

export type TLetterListParams = TPageListType & {
  createTime?: number;
  title?: string;
  platform?: EPlatform;
  letterId?: number;
  startTime?: string;
  endTime?: string;
};

export type TAddLetterParams = Omit<
  TLetterItem,
  'hasReadCount' | 'notReadCount' | 'createdTime' | 'updateTime' | 'letterId'
>;

export type TUser = {
  id: number;
  username: string;
  avatar?: string;
  sex: 1 | 0;
  phone?: string;
  mail?: string;
};

export type TLetterRecordUserParams = {
  letterId: number;
  status: EStatus;
};

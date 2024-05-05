export enum EOrderStatus {
  未申诉 = 0,
  已申诉,
  招募中,
  已开庭,
  已结束,
}

export const orderStatusMap = {
  0: '未申诉',
  1: '已申诉',
  2: '招募中',
  3: '已开庭',
  4: '已结束',
};

export type TOrder = {
  id: number;
  orderStatus: EOrderStatus;
  consumerUserId: number;
  providerUserId: number;
  startTime: string;
  explainTime: string;
  orderId: string;
};

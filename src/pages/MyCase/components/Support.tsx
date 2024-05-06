import { TMyCaseItem } from '@/services/myCase';
import { Modal, Radio } from 'antd';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

type TProps = {
  chooseOrder?: TMyCaseItem;
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function SupportModal({ chooseOrder, open, onOk, onCancel }: TProps) {
  const [choose, setChoose] = useState<number>();

  return (
    <Modal title={'选择用户进行投票'} open={open} onOk={() => onOk(choose)} onCancel={onCancel}>
      <Radio.Group
        onChange={(val) => {
          const value = val.target.value;
          setChoose(value);
        }}
        value={choose}
      >
        <Radio value={chooseOrder?.userId1 || '1'}>{chooseOrder?.user1 || '用户1'}</Radio>
        <Radio value={chooseOrder?.userId1 || '2'}>{chooseOrder?.user2 || '用户2'}</Radio>
      </Radio.Group>
    </Modal>
  );
}

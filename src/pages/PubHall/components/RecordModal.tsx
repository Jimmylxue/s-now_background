import { TPubHallItem } from '@/services/pubHall';
import { Button, Modal, Table, TableProps } from 'antd';

type TProps = {
  recordData?: TPubHallItem['orderExplainMessages'];
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function RecordModal({ recordData, open, onOk, onCancel }: TProps) {
  const columns: TableProps<TPubHallItem['orderExplainMessages']['0']>['columns'] = [
    {
      title: '用户id',
      dataIndex: 'userId',
      key: 'userId',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '补充文案',
      dataIndex: 'userText',
      key: 'userText',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          onClick={async () => {
            try {
              // await mutateAsync({
              //   orderId: record.orderId,
              // });
            } catch (error) {}
          }}
        >
          下载资料
        </Button>,
      ],
    },
  ];

  return (
    <Modal title={'证据列表'} open={open} onOk={onOk} onCancel={onCancel}>
      <Table columns={columns} dataSource={recordData || ([] as any)} />
    </Modal>
  );
}

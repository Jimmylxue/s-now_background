import { useDownloadFile } from '@/services/order';
import { TPubHallItem } from '@/services/pubHall';
import { downloadWithBlob } from '@/utils';
import { request } from '@umijs/max';
import { Button, Modal, Table, TableProps, message } from 'antd';

type TProps = {
  recordData?: TPubHallItem['orderExplainMessages'];
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
};

export function RecordModal({ recordData, open, onOk, onCancel }: TProps) {
  const { mutateAsync } = useDownloadFile();

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
              const path = record.filePath.split('opt/')?.[1];
              if (!path) {
                message.info('没有文件或文件异常');
                return;
              }
              let base = 'http://175.178.248.238:8080/api';
              let qut = `download/${path || '20240508_21121692.png'}`;
              let url = `${base}/${qut}`;
              let res = await request(url, {
                method: 'POST',
                headers: {
                  Authorization: localStorage.getItem('token') || '',
                },
                getResponse: true,
              });
              let blob = new Blob([res.data]);
              let ext = qut.split('.')?.[1];
              let name_temp = qut.split('.')?.[0].split('/');
              let name = name_temp[name_temp.length - 1];
              await downloadWithBlob(blob, `${name}.${ext}`);
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

import React from 'react';
import { Modal, Descriptions } from "antd";
import { formartMoney } from "@/utils";
import moment from 'moment';

const DetailsInfoModal = ({ detailsValue, visible, onCancel }) => {
  return (
    <Modal
      title="详情"
      maskClosable={false}
      visible={visible}
      footer={null}
      onCancel={onCancel}
      width={800}
    >
      <Descriptions title="收款账户信息" column={3}>
        <Descriptions.Item label="开户行">{detailsValue.accept_bank ? detailsValue.accept_bank : '-'}</Descriptions.Item>
        <Descriptions.Item label="户主">{detailsValue.accept_contact ? detailsValue.accept_contact : '-'}</Descriptions.Item>
        <Descriptions.Item label="账号">{detailsValue.accept_account ? detailsValue.accept_account : '-'}</Descriptions.Item>
        <Descriptions.Item label="总打款金额"><span style={{ fontSize: '20px' }}>{formartMoney(detailsValue.crash_money)}</span></Descriptions.Item>
      </Descriptions>
      <Descriptions title="打款信息" column={2}>
        <Descriptions.Item label="银行流水号" span={2}>{detailsValue.payment_bank_id ? detailsValue.payment_bank_id : '-'}</Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>{detailsValue.payment_remark ? detailsValue.payment_remark : '-'}</Descriptions.Item>
        <Descriptions.Item label="附件" span={2} className="attachment">
          {
            detailsValue.payment_attachment ?
              detailsValue.payment_attachment.map((item, index) => {
                return (
                  <div key={index}>
                    <div>{item.file_name} <a href={item.file_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>查看下载</a></div>
                    <div style={{ color: '#ccc', fontSize: '12px' }}>{moment(item.file_time * 1000).format("YYYY-MM-DD HH:mm:ss")} {item.admin_name} {item.file_size}M</div>
                  </div>
                )
              })
              : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default DetailsInfoModal;
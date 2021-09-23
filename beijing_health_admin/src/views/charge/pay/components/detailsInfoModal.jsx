import React from 'react';
import { Modal, Descriptions, Badge } from "antd";
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
      <Descriptions column={4}>
        <Descriptions.Item label="任务ID">{detailsValue.pay_id}</Descriptions.Item>
        <Descriptions.Item label="上报人">{detailsValue.doctor_name}</Descriptions.Item>
        <Descriptions.Item label="付费金额（元）">{formartMoney(detailsValue.pay_money)}</Descriptions.Item>
        <Descriptions.Item label="状态">
          {
            (function () {
              const { status } = detailsValue;
              if (status === 1) {
                return <span style={{ color: '#faad14' }}><Badge status="warning" />审核中</span>
              }
              if (status === 3) {
                return <span style={{ color: '#1890ff' }}><Badge status="processing" />付款完成</span>
              }
              if (status === 10) {
                return <span style={{ color: '#ff4d4f' }}><Badge status="error" />已驳回</span>
              }
            })()
          }
        </Descriptions.Item>
        <Descriptions.Item label="付费说明" span="4">{detailsValue.pay_describe ? detailsValue.pay_describe : '-'}</Descriptions.Item>
        <Descriptions.Item label="发起时间" span="2">{moment(detailsValue.create_time).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="最新审核时间" span="2">{detailsValue.verify_time ? moment(detailsValue.verify_time).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
        <Descriptions.Item label="驳回理由" span="4">{detailsValue.verify_fail_reason ? detailsValue.verify_fail_reason : '-'}</Descriptions.Item>
        <Descriptions.Item label="任务附件" span="4" className="attachment">
          {
            detailsValue.pay_attachment ?
              detailsValue.pay_attachment.map((item, index) => {
                return (
                  <div key={index}>
                    <div>{item.file_name} <a href={item.file_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>查看下载</a></div>
                    <div style={{ color: '#ccc', fontSize: '12px' }}>{moment(item.file_time * 1000).format("YYYY-MM-DD HH:mm:ss")} {item.doctor_name} {item.file_size}M</div>
                  </div>
                )
              })
              : '-'
          }
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title="收款方联系人" column={2}>
        <Descriptions.Item label="姓名">{detailsValue.accept_contact ? detailsValue.accept_contact : '-'}</Descriptions.Item>
        <Descriptions.Item label="电话">{detailsValue.accept_mobile ? detailsValue.accept_mobile : '-'}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="收款账户信息" column={2}>
        <Descriptions.Item label="单位">{detailsValue.accept_company ? detailsValue.accept_company : '-'}</Descriptions.Item>
        <Descriptions.Item label="开户行">{detailsValue.accept_bank ? detailsValue.accept_bank : '-'}</Descriptions.Item>
        <Descriptions.Item label="账号">{detailsValue.accept_account ? detailsValue.accept_account : '-'}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="打款信息" column={2}>
        <Descriptions.Item label="银行流水号" span="2">{detailsValue.payment_bank_id ? detailsValue.payment_bank_id : '-'}</Descriptions.Item>
        <Descriptions.Item label="备注" span="2">{detailsValue.payment_remark ? detailsValue.payment_remark : '-'}</Descriptions.Item>
        <Descriptions.Item label="附件" span="2" className="attachment">
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
              : '-'
          }
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default DetailsInfoModal;
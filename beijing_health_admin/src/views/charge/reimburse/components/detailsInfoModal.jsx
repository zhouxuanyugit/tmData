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
        <Descriptions.Item label="报销ID">{detailsValue.expense_id}</Descriptions.Item>
        <Descriptions.Item label="报销人">{detailsValue.doctor_name}</Descriptions.Item>
        <Descriptions.Item label="报销金额">{formartMoney(detailsValue.expense_money)} 元</Descriptions.Item>
        <Descriptions.Item label="状态">
          {
            (function () {
              const { status } = detailsValue;
              if (status === 1) {
                return <span style={{ color: '#faad14' }}><Badge status="warning" />待审核</span>
              }
              if (status === 2) {
                return <span style={{ color: '#1890ff' }}><Badge status="processing" />审核通过</span>
              }
              if (status === 10) {
                return <span style={{ color: '#ff4d4f' }}><Badge status="error" />已驳回</span>
              }
            })()
          }
        </Descriptions.Item>
        <Descriptions.Item label="费用类别" span="4">{detailsValue.expense_type_name}</Descriptions.Item>
        <Descriptions.Item label="报销说明" span="4">{detailsValue.expense_describe}</Descriptions.Item>
        <Descriptions.Item label="发起时间" span="2">{detailsValue.create_time ? moment(detailsValue.create_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
        <Descriptions.Item label="最新审核时间" span="2">{detailsValue.verify_time ? moment(detailsValue.verify_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
        <Descriptions.Item label="驳回理由" span="4">{detailsValue.verify_fail_reason ? detailsValue.verify_fail_reason : '-'}</Descriptions.Item>
        <Descriptions.Item label="任务附件" span="4"  className="attachment">
        {
            detailsValue.expense_attachment ?
              detailsValue.expense_attachment.map((item, index) => {
                return (
                  <div key={index}>
                    <div>{item.file_name} <a href={item.file_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>查看下载</a></div>
                    <div style={{ color: '#ccc', fontSize: '12px' }}>{moment(item.file_time * 1000).format("YYYY-MM-DD HH:mm:ss")} {item.doctor_name} {item.file_size}M</div>
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
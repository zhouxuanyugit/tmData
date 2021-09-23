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
      <Descriptions column={3}>
        <Descriptions.Item label="任务ID">{detailsValue.task_id}</Descriptions.Item>
        <Descriptions.Item label="执行人">{detailsValue.execute_doctor_name}</Descriptions.Item>
        <Descriptions.Item label="状态">
          {
            (function () {
              const { status } = detailsValue;
              if (status === 1) {
                return <span style={{ color: '#52c41a' }}><Badge status="success" />进行中</span>
              }
              if (status === 4) {
                return <span style={{ color: '#faad14' }}><Badge status="warning" />待审核</span>
              }
              if (status === 5) {
                return <span style={{ color: '#1890ff' }}><Badge status="processing" />审核通过</span>
              }
              if (status === 10) {
                return <span style={{ color: '#ff4d4f' }}><Badge status="error" />已驳回</span>
              }
              if (status === 3) {
                return <span style={{ color: '#d9d9d9' }}><Badge status="default" />已取消</span>
              }
            })()
          }
        </Descriptions.Item>
        <Descriptions.Item label="任务描述" span="3">{detailsValue.task_describe}</Descriptions.Item>
        <Descriptions.Item label="任务类型">{detailsValue.task_type_name}</Descriptions.Item>
        <Descriptions.Item label="付费模式">{detailsValue.task_charge_type === 1 ? '按次付费' : '按月付费'}</Descriptions.Item>
        <Descriptions.Item label="付费金额">{formartMoney(detailsValue.task_charge_money)}</Descriptions.Item>
        <Descriptions.Item label="家庭">{detailsValue.family_name ? detailsValue.family_name : '-'}</Descriptions.Item>
        <Descriptions.Item label="地点" span="2">{detailsValue.task_address ? detailsValue.task_address : '-'}</Descriptions.Item>
        <Descriptions.Item label="发起时间">{detailsValue.create_time ? moment(detailsValue.create_time * 1000).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
        <Descriptions.Item label="签到时间">{detailsValue.sign_time ? moment(detailsValue.sign_time * 1000).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
        <Descriptions.Item label="完成时间">{detailsValue.complete_time ? moment(detailsValue.complete_time * 1000).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
        <Descriptions.Item label="取消时间">{detailsValue.cancel_time ? moment(detailsValue.cancel_time * 1000).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
        <Descriptions.Item label="最新审核时间" span="2">{detailsValue.verify_time ? moment(detailsValue.verify_time * 1000).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
        <Descriptions.Item label="驳回理由" span="3">{detailsValue.verify_fail_reason ? detailsValue.verify_fail_reason : '-'}</Descriptions.Item>
        <Descriptions.Item label="任务附件" span="3" className="attachment">
          {
            detailsValue.task_attachment ?
              detailsValue.task_attachment.map((item, index) => {
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
    </Modal>
  );
}

export default DetailsInfoModal;
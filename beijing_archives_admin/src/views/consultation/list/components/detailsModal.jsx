import React from 'react';
import { Modal, Descriptions, Divider } from "antd";
import moment from 'moment';

const DetailsInfoModal = ({ detailsValue, visible, onCancel }) => {
  return (
    <Modal
      title="会诊详情"
      maskClosable={false}
      visible={visible}
      onOk={onCancel}
      onCancel={onCancel}
      width={800}
    >
      <Descriptions column={2}>
        <Descriptions.Item label="会诊时间">{moment(detailsValue.union_time * 1000).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="会诊专家">{detailsValue.expert_content}</Descriptions.Item>
        <Descriptions.Item label="机构名称" span="2">{detailsValue.organization}</Descriptions.Item>
        <Descriptions.Item label="医嘱时间">{moment(detailsValue.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
        <Descriptions.Item label="下嘱医生">{detailsValue.sign_expert}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions column={2}>
        <Descriptions.Item label="备注" span="2">{detailsValue.remarks ? detailsValue.remarks : '--'}</Descriptions.Item>
      </Descriptions>
    </Modal >
  );
}

export default DetailsInfoModal;
import React from 'react';
import { Modal, Descriptions, Divider } from "antd";
import moment from 'moment';

const DetailsInfoModal = ({ detailsValue, visible, onCancel }) => {
  return (
    <Modal
      title="医嘱详情"
      maskClosable={false}
      visible={visible}
      onOk={onCancel}
      onCancel={onCancel}
      width={800}
    >
      <Descriptions column={2}>
        <Descriptions.Item label="委托人代号">{detailsValue.code}</Descriptions.Item>
        <Descriptions.Item label="医嘱类型">{detailsValue.time_type === 1 ? '临时医嘱' : '长期医嘱'}</Descriptions.Item>
        <Descriptions.Item label="医嘱分类">{detailsValue.say_type === 1 ? '用药医嘱' : detailsValue.say_type === 2 ? '非药品治疗医嘱' : '保健医嘱'}</Descriptions.Item>
        <Descriptions.Item label="下嘱时间">{moment(detailsValue.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions column={2}>
        <Descriptions.Item label="下嘱医生" span="2">{detailsValue.sign_doctor}</Descriptions.Item>
        <Descriptions.Item label="医嘱" span="2">{detailsValue.say}</Descriptions.Item>
        <Descriptions.Item label="规格">{detailsValue.spec ? detailsValue.spec : '--'}</Descriptions.Item>
        <Descriptions.Item label="剂量">{detailsValue.dose ? detailsValue.dose : '--'}</Descriptions.Item>
        <Descriptions.Item label="途径">{detailsValue.channel ? detailsValue.channel : '--'}</Descriptions.Item>
        <Descriptions.Item label="频次">{detailsValue.frequency ? detailsValue.frequency : '--'}</Descriptions.Item>
        <Descriptions.Item label="治疗开始时间">{moment(detailsValue.treatment_start_time * 1000).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="治疗结束时间">{moment(detailsValue.treatment_end_time * 1000).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="是否摆药">{detailsValue.is_get_drug === 1 ? '是' : detailsValue.is_get_drug === 2 ? '否' : '--'}</Descriptions.Item>
        <Descriptions.Item label="是否自备">{detailsValue.is_own === 1 ? '是' : detailsValue.is_own === 2 ? '否' : '--'}</Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions column={2}>
        <Descriptions.Item label="附加说明" span="2">{detailsValue.explain ? detailsValue.explain : '--'}</Descriptions.Item>
        <Descriptions.Item label="备注" span="2">{detailsValue.remarks ? detailsValue.remarks : '--'}</Descriptions.Item>
      </Descriptions>
    </Modal >
  );
}

export default DetailsInfoModal;
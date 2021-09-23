import React from 'react';
import { Modal, Input } from "antd";
const { TextArea } = Input;

const RejectReasonModal = ({ visible, onOk, onCancel, value, onChange }) => {
  return (
    <Modal
      title="驳回理由"
      maskClosable={false}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="确认"
      cancelText="取消"
    >
      <TextArea
        showCount
        maxLength={100}
        value={value}
        onChange={onChange}
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
    </Modal>
  );
}

export default RejectReasonModal;
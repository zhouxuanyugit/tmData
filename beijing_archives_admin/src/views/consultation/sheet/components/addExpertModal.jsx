import React from "react";
import { Form, Input, Modal } from "antd";

const AddForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title="添加专家"
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form
        preserve={false}
        form={form}
        {...formItemLayout}
      >
        <Form.Item
          label="名称:"
          name="name"
          rules={[{ required: true, message: "请输入专家名称!" }]}
        >
          <Input placeholder="请输入专家名称" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="专业:"
          name="major"
          rules={[{ required: true, message: "请输入专业!" }]}
        >
          <Input placeholder="请输入专业" maxLength={20} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddForm;

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
      title="添加委托人"
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
        className="add-patient-modal"
      >
        <Form.Item
          label="委托人代号:"
          name="code"
          rules={[{ required: true, message: "请输入委托人代号!" }]}
        >
          <Input placeholder="请输入委托人代号（最长6个字符）" maxLength={6} />
        </Form.Item>
      </Form>
      <div className="add-patient-tips">
        <span>请勿使用委托人真实姓名作为代号</span>
      </div>
    </Modal>
  );
}

export default AddForm;

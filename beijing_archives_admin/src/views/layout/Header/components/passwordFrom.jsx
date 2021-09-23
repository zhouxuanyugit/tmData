import React from "react";
import { Form, Input, Modal, message } from "antd";
const PasswordForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title="修改密码"
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (values.pass_word !== values.confirm_password) {
              message.warn('新密码不一致');
              return false
            }
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        {...formItemLayout}
      >
        <Form.Item
          label="原密码:"
          name="old_pass_word"
          rules={[{ required: true, whitespace: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" maxLength={20} />
        </Form.Item>
        <Form.Item
          label="新密码:"
          name="pass_word"
          rules={[{ required: true, whitespace: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" maxLength={20} />
        </Form.Item>
        <Form.Item
          label="新密码确认:"
          name="confirm_password"
          rules={[{ required: true, whitespace: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" maxLength={20} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PasswordForm;

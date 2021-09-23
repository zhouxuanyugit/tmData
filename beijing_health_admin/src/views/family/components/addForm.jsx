import React from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input;

const AddForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title="添加"
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
          label="家庭名称:"
          name="family_name"
          rules={[{ required: true, message: "请输入家庭名称!" }]}>
          <Input placeholder="请输入家庭名称（最长10个字符）" maxLength={10}/>
        </Form.Item>
        <Form.Item
          label="家庭描述:"
          name="family_describe">
          <TextArea rows={4} maxLength={500}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddForm;

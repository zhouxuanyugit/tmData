import React from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
const { TextArea } = Input;
moment.locale("zh-cn");
const EditForm = ({ visible, onCancel, onOk, confirmLoading, editData }) => {
  const [form] = Form.useForm();
  const { family_id, family_name, family_describe } = editData;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  return (
    <Modal
      title="编辑"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.family_id = family_id;
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
      destroyOnClose
      forceRender
    >
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{
          family_name,
          family_describe
        }}
      >
        <Form.Item
          label="家庭名称:"
          name="family_name"
          rules={[{ required: true, message: "家庭名称!" }]}>
          <Input placeholder="请输入家庭名称（最长10个字符）" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="家庭描述:"
          name="family_describe">
          <TextArea rows={4} maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditForm;

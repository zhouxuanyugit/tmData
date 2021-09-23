import React from "react";
import { Form, Input, Modal, InputNumber } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const AddEditForm = ({ visible, onCancel, onOk, confirmLoading, addEditData }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title={!addEditData.type_id ? '添加' : '编辑'}
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (addEditData.type_id) {
              values.type_id = addEditData.type_id
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
        initialValues={{ ...addEditData }}
      >
        <Form.Item
          label="序号:"
          name="sort_id"
          rules={[{ required: true, message: "请输入序号!" }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="费用名称:"
          name="expense_name"
          rules={[{ required: true, message: "请输入费用名称!" }]}>
          <Input placeholder="请输入费用名称（最长10个字符）" maxLength={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditForm;

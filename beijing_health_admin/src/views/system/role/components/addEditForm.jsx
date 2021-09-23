import React from "react";
import { Form, Input, Modal } from "antd";
import propTypes from "prop-types";
const AddEditForm = ({ visible, onCancel, onOk, confirmLoading, addEditData }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title={!addEditData.role_id ? '添加' : '编辑'}
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (addEditData.role_id) {
              values.role_id = addEditData.role_id
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
          label="角色名称:"
          name="role_name"
          rules={[{ required: true, message: "请输入角色名称!" }]}>
          <Input placeholder="请输入角色名称（最长6个字符）" maxLength={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

AddEditForm.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onOk: propTypes.func.isRequired,
  confirmLoading: propTypes.bool.isRequired,
  addEditData: propTypes.object.isRequired
}

export default AddEditForm;

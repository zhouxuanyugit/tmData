import React from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { phoneValidator } from "@/utils/validator";
import "moment/locale/zh-cn";
const { TextArea } = Input;
moment.locale("zh-cn");
const AddEditForm = ({ visible, onCancel, onOk, confirmLoading, addEditData }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title={!addEditData.member_id ? '添加' : '编辑'}
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (addEditData.member_id) {
              values.member_id = addEditData.member_id;
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
          label="成员名称:"
          name="member_name"
          rules={[{ required: true, message: "请输入成员名称!" }]}>
          <Input placeholder="请输入成员名称（最长10个字符）" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="手机号:"
          name="mobile"
          rules={[{ required: true, message: "请输入手机号!" }, {
            validator: (_, value) =>
              !value || phoneValidator(value) ? Promise.resolve() : Promise.reject('手机格式错误！'),
          }]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>
        <Form.Item
          label="成员简介:"
          name="member_brief"
          rules={[{ required: true, message: "请输入成员简介!" }]}>
          <TextArea showCount maxLength={300} autoSize={{ minRows: 4, maxRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditForm;

import React from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import { bankAccountValidator } from "@/utils/validator";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const AccountForm = ({ visible, onCancel, onOk, confirmLoading, accountModalData }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title="收款账号"
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (accountModalData.doctor_id) {
              values.doctor_id = accountModalData.doctor_id
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
        initialValues={{ ...accountModalData }}
      >
        <Form.Item
          label="开户行:"
          name="accept_bank"
          rules={[{ required: true, message: "请输入开户行!" }]}>
          <Input placeholder="请输入开户行（最长30个字符）" maxLength={30} />
        </Form.Item>
        <Form.Item
          label="户主:"
          name="accept_contact"
          rules={[{ required: true, message: "请输入户主!" }]}>
          <Input placeholder="请输入户主" maxLength={11} />
        </Form.Item>
        <Form.Item
          label="卡号:"
          name="accept_account"
          rules={[{ required: true, message: "请输入卡号!" }, {
            validator: (_, value) =>
              !value || bankAccountValidator(value) ? Promise.resolve() : Promise.reject('卡号格式错误！'),
          }]}>
          <Input placeholder="请输入卡号" maxLength={30} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AccountForm;

import React from "react";
import { Form, Input, Modal, Select } from "antd";
import moment from "moment";
import { phoneValidator } from "@/utils/validator";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const AddEditForm = ({ visible, onCancel, onOk, confirmLoading, addEditData, roleList }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title={!addEditData.id ? '添加' : '编辑'}
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (addEditData.id) {
              values.id = addEditData.id
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
          label="用户名称:"
          name="user_name"
          rules={[{ required: true, message: "请输入用户名称!" }]}>
          <Input placeholder="请输入用户名称（最长6个字符）" maxLength={6} />
        </Form.Item>
        <Form.Item
          label="手机号:"
          name="account"
          rules={[{ required: true, message: "请输入手机号!" }, {
            validator: (_, value) =>
              !value || phoneValidator(value) ? Promise.resolve() : Promise.reject('手机格式错误！'),
          }]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>
        {
          !addEditData.id ?
            <Form.Item
              label="密码"
              name="pass_word"
              rules={[{ required: true, whitespace: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" />
            </Form.Item> : null
        }
        <Form.Item
          label="角色:"
          name="role_id"
          rules={[{ required: true, message: "请选择角色!" }]}>
          <Select>
            {
              roleList.map((item, index) => (
                <Select.Option value={item.id} key={index}>{item.role}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditForm;

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
      title={!addEditData.doctor_id ? '添加' : '编辑'}
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            if (addEditData.doctor_id) {
              values.doctor_id = addEditData.doctor_id
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
          name="doctor_name"
          rules={[{ required: true, message: "请输入用户名称!" }]}>
          <Input placeholder="请输入用户名称（最长10个字符）" maxLength={10} />
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
          label="角色:"
          name="role_id"
          rules={[{ required: true, message: "请选择角色!" }]}>
          <Select>
            {
              roleList.map((item, index) => (
                <Select.Option value={item.role_id} key={index}>{item.role_name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditForm;

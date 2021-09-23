import React from "react";
import { Form, Input, Modal, Select, InputNumber } from "antd";
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
          label="类型名称:"
          name="type_name"
          rules={[{ required: true, message: "请输入类型名称!" }]}>
          <Input placeholder="请输入类型名称（最长20个字符）" maxLength={20} />
        </Form.Item>
        <Form.Item
          label="付费模式:"
          name="charge_type"
          rules={[{ required: true, message: "请输入付费模式!" }]}>
          <Select>
            <Select.Option value={1}>按次付费</Select.Option>
            <Select.Option value={2}>按月付费</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="付费金额:"
          name="charge_money"
          rules={[{ required: true, message: "请输入付费金额!" }]}>
          <InputNumber
            style={{ width: '150px' }}
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditForm;

import React from "react";
import { Form, Input, Modal } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
const AddEditForm = ({ visible, onCancel, onOk, confirmLoading, addEditData, title }) => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title={!addEditData.id ? `添加${title}` : `编辑${title}`}
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
          label="标题:"
          name="title"
          rules={[{ required: true, message: "请输入标题!" }]}>
          <Input placeholder="请输入标题" maxLength={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddEditForm;

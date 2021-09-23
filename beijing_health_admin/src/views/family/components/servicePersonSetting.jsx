import React, { Component } from "react";
import { Form, Modal, Select, Button, message } from "antd";
import { updateFamily } from "@/api/family";
import { uniqueArr } from "@/utils";
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class ServicePersonSetting extends Component {
  formRef = React.createRef();
  state = {
    visible: false,
    confirmLoading: false,

    family_id: 0,
    doctorData: [],
    nurseData: [],
    assistantData: []
  }
  //初始化modal的时候赋值
  handleServicePersonSetting = () => {
    let { family_id, doctor_info, nurse_info, assistant_info } = this.props.data;
    this.setState({
      visible: true,
      family_id,
      doctorData: this.objChangeToIdArr(doctor_info),
      nurseData: this.objChangeToIdArr(nurse_info),
      assistantData: this.objChangeToIdArr(assistant_info)
    });
  }
  onOk = (value) => {
    const allData = value.doctor.concat(value.nurse, value.assistant);
    if (allData.length === uniqueArr(allData).length) {
      this.setState({ confirmLoading: true })
      updateFamily({
        family_id: this.state.family_id,
        doctor_info: value.doctor.join(','),
        nurse_info: value.nurse.join(','),
        assistant_info: value.assistant.join(',')
      }).then(() => {
        this.setState({ visible: false, confirmLoading: false });
        this.props.fetchData();
      })
    } else {
      message.error("同一个人不能同时添加！")
    }
  }
  onCancel = () => {
    this.setState({ visible: false });
  }
  objChangeToIdArr = (dataObj) => {
    let nameArr = [];
    dataObj.forEach(element => {
      nameArr.push(element.doctor_id);
    });
    return nameArr;
  }
  render() {
    const { visible, confirmLoading, doctorData, nurseData, assistantData } = this.state;
    const { serviceDataList } = this.props;
    let children = [];
    for (let i = 0, slen = serviceDataList.length; i < slen; i++) {
      if (serviceDataList[i].status === 1) {
        children.push(
          <Option
            key={serviceDataList[i].doctor_id}
            value={serviceDataList[i].doctor_id}
          >
            {serviceDataList[i].doctor_name}
          </Option>
        );
      }

    }
    return (
      <>
        <Button type="link" onClick={this.handleServicePersonSetting}>服务人员设置</Button>
        {
          this.state.visible ?
            <Modal
              title="服务人员设置"
              visible={visible}
              onCancel={this.onCancel}
              maskClosable={false}
              onOk={() => {
                this.formRef.current.validateFields()
                  .then((values) => {
                    this.onOk(values);
                  })
                  .catch((info) => {
                    console.log('Validate Failed:', info);
                  });
              }}
              confirmLoading={confirmLoading}
            >
              <Form
                ref={this.formRef}
                {...formItemLayout}
                initialValues={{
                  doctor: doctorData,
                  nurse: nurseData,
                  assistant: assistantData
                }}
              >
                <Form.Item
                  label="服务医生:"
                  name="doctor"
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择服务医生"
                  >
                    {children}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="服务护士:"
                  name="nurse"
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择服务护士"
                  >
                    {children}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="服务助理:"
                  name="assistant"
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择服务助理"
                  >
                    {children}
                  </Select>
                </Form.Item>
              </Form>
            </Modal> : null
        }
      </>
    );
  }
};

export default ServicePersonSetting;

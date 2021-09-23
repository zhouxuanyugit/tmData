import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message
} from "antd";
import { connect } from "react-redux";
import { addTag } from "@/store/actions";
import { Context } from "../index";
import { getPatientInfo, updatePatientInfo } from "@/api/patient";

const { Title } = Typography;

const DatailsInfo = ({ addTag, history }) => {
  const { chareData, dispatch } = useContext(Context);
  const [form] = Form.useForm();
  useEffect(() => {
    console.log('------重新获取信息');
    chareData.id && getInfo();
  }, [chareData]);
  const getInfo = async () => {
    const { id } = chareData;
    const result = await getPatientInfo({ id });
    const details = result.data;
    form.setFieldsValue({ ...details });
  }
  const onFinish = async (values) => {
    const { id } = chareData;
    const result = await updatePatientInfo({ ...values, id });
    if (result) {
      message.success('修改成功！')
    }
  }
  const handleGoToDetails = (index) => {
    const menuObj = {
      // icon: 'details',
      path: '/patient/details/' + chareData.id,
      title: chareData.code + '的病历'
    }
    addTag(menuObj);
    /* TODO: 已知bug，刷新state参数会丢失 因为有tab切换，不能存到url里面 */
    history.push({
      pathname: '/patient/details/' + chareData.id,
      state: { menuIndex: index }
    });
  }
  const handleGoToDoctorAdvice = () => {
    /* TODO: 先默认跳转到用药医嘱上 */
    const menuObj = {
      path: '/doctorAdvice/list/1',
      title: '用药医嘱'
    }
    addTag(menuObj);
    history.push({
      pathname: '/doctorAdvice/list/1',
      state: { id: chareData.id }
    });
  }
  const handleGoToConsultation = () => {
    const menuObj = {
      path: '/consultation/list',
      title: '会诊记录'
    }
    addTag(menuObj);
    history.push({
      pathname: '/consultation/list',
      // state: { id: chareData.id }
    });
  }
  return (
    <div className="details-info-container">
      <Title level={2} className="details-title">患者基本信息</Title>
      {
        chareData.id ?
          <div>
            <div className="details-content">
              <Form
                layout="inline"
                form={form}
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="代号：" name="code">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="性别：" name="sex">
                      <Select>
                        <Select.Option value={1}>男</Select.Option>
                        <Select.Option value={2}>女</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="身高：" name="height">
                      <Input suffix="CM" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="民族：" name="nation">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="体重：" name="weight">
                      <Input suffix="Kg" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="血型：" name="blood">
                      <Input suffix="型" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Form.Item label="婚姻：" name="is_marry">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item label="籍贯：" name="native_place">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item label="出生年月：" name="birthday">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label="出生地：" name="birth_address">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={4} offset={8}>
                    <Form.Item style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit">保存信息</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

            <div className="details-btns">
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('1')}>
                健康档案首页
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('3')}>
                文档报告
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDoctorAdvice()}>
                医嘱
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToConsultation()}>
                会诊
              </Button>
              <p></p>
              <Title level={3}>病案管理</Title>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('20')}>
                病案首页
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('21')}>
                大事记
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('22')}>
                急救预案
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('23')}>
                保健计划
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('24')}>
                病历记录
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('25')}>
                病情总结
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('26')}>
                访视观察
              </Button>
              <Button type="primary" className="btn" onClick={() => handleGoToDetails('27')}>
                出诊记录单
              </Button>
            </div>
          </div> : null
      }
    </div>
  )
}

export default connect((state) => state.user, { addTag })(withRouter(DatailsInfo));
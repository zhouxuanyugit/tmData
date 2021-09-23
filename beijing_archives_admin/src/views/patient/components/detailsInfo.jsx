import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message,
  Card,
  DatePicker,
  Cascader
} from "antd";
import { CITY_DATA } from "@/utils/constants";
import { connect } from "react-redux";
import { addTag } from "@/store/actions";
import { Context } from "../index";
import { getPatientInfo, updatePatientInfo } from "@/api/patient";
import moment from 'moment';

const { Title } = Typography;

const DatailsInfo = ({ addTag, history, menu, updateTable }) => {
  const { chareData } = useContext(Context);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('------重新获取信息');
    chareData.id && getInfo();
  }, [chareData]);

  const getInfo = async () => {
    const { id } = chareData;
    const result = await getPatientInfo({ id });
    const details = result.data;

    details.birthday = details.birthday ? moment(details.birthday) : '';

    // 以下设置为了方便placeholder显示出来
    details.blood = details.blood ? details.blood : null;
    details.is_marry = details.is_marry ? details.is_marry : null;
    details.native_place = details.native_place ? details.native_place.split(',') : '';
    details.birth_address = details.birth_address ? details.birth_address.split(',') : '';

    form.setFieldsValue({ ...details });
  }

  const onFinish = async (values) => {
    const { id } = chareData;
    values.code = values.code.replace(/^\s+|\s+$/g, "");
    if (!values.code) {
      message.error('代号不能为空！')
      return
    }
    values.native_place = values.native_place ? values.native_place.join(',') : '';
    values.birth_address = values.birth_address ? values.birth_address.join(',') : '';
    const result = await updatePatientInfo({ ...values, id });
    if (result) {
      message.success('修改成功！');
      updateTable();
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
      state: { patientId: chareData.id }
    });
  }

  return (
    <div className="details-info-container">
      {
        chareData.id ?
          <div>
            <div>
              委托人编号：{ }
            </div>
            <div className="details-content">
              <Title level={4} className="details-title">委托人基本信息</Title>
              <Form
                layout="inline"
                form={form}
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label={<span><i className="required-start">*</i> 代号</span>} name="code">
                      <Input bordered={false} maxLength={6} style={{ borderBottom: '1px solid #ccc' }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label="性别：" name="sex">
                      <Select bordered={false} style={{ borderBottom: '1px solid #ccc' }}>
                        <Select.Option value={1}>男</Select.Option>
                        <Select.Option value={2}>女</Select.Option>
                        <Select.Option value={3}>保密</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label="身高：" name="height" getValueFromEvent={(event) => { return event.target.value.replace(/\D/g,'') }}>
                      <Input suffix="CM" maxLength={4} bordered={false} style={{ borderBottom: '1px solid #ccc' }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label="民族：" name="nation">
                      <Input bordered={false} maxLength={5} style={{ borderBottom: '1px solid #ccc' }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label="体重：" name="weight" getValueFromEvent={(event) => { return event.target.value.replace(/\D/g,'') }}>
                      <Input suffix="Kg" maxLength={4} bordered={false} style={{ borderBottom: '1px solid #ccc' }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label="血型：" name="blood">
                      <Select bordered={false} style={{ borderBottom: '1px solid #ccc' }}>
                        <Select.Option value="A">A</Select.Option>
                        <Select.Option value="B">B</Select.Option>
                        <Select.Option value="AB">AB</Select.Option>
                        <Select.Option value="O">O</Select.Option>
                        <Select.Option value="5">保密</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={4}>
                    <Form.Item label="婚姻：" name="is_marry">
                      <Select bordered={false} style={{ borderBottom: '1px solid #ccc' }}>
                        <Select.Option value="1">已婚</Select.Option>
                        <Select.Option value="2">未婚</Select.Option>
                        <Select.Option value="3">离异</Select.Option>
                        <Select.Option value="4">丧偶</Select.Option>
                        <Select.Option value="5">保密</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={6}>
                    <Form.Item label="籍贯：" name="native_place">
                      <Cascader options={CITY_DATA} allowClear={false} bordered={false} style={{ borderBottom: '1px solid #ccc' }} placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={8} xl={6}>
                    <Form.Item label="出生地：" name="birth_address">
                      <Cascader options={CITY_DATA} allowClear={false} bordered={false} style={{ borderBottom: '1px solid #ccc' }} placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={12} xl={8}>
                    <Form.Item label="出生年月：" name="birthday">
                      <DatePicker picker="month" allowClear={false} bordered={false} style={{ borderBottom: '1px solid #ccc' }} placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={24} xl={16}>
                    <Form.Item label="详细地址：" name="detail_address">
                      <Input maxLength={40} bordered={false} style={{ borderBottom: '1px solid #ccc' }} />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={16} xl={8}>
                    <Form.Item style={{ textAlign: 'right' }}>
                      {
                        menu.includes('0-1') ?
                          <Button type="primary" htmlType="submit">保存信息</Button> : null
                      }
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

            <div className="details-btns">
              <Row gutter={[30, 24]}>
                <Col md={12} xl={8} className="card-item">
                  <Card size="small" headStyle={{ backgroundColor: 'rgb(102, 177, 255)', color: '#fff' }} title="健康信息">
                    <div className="cart-item-container first">
                      {menu.includes('1-0') ? <Button type="link" onClick={() => handleGoToDetails('1')}><i></i> 健康档案首页</Button> : null}
                      {menu.includes('1-9') ? <Button type="link" onClick={() => handleGoToDetails('3')}><i></i> 文档报告</Button> : null}
                    </div>
                  </Card>
                </Col>
                <Col md={12} xl={8} className="card-item">
                  <Card size="small" headStyle={{ backgroundColor: 'rgb(102, 177, 255)', color: '#fff' }} title="病案管理">
                    <div className="cart-item-container">
                      {menu.includes('1-1') ? <Button type="link" onClick={() => handleGoToDetails('20')}><i></i> 病案首页</Button> : null}
                      {menu.includes('1-2') ? <Button type="link" style={{ width: '120px', textAlign: 'left' }} onClick={() => handleGoToDetails('21')}><i></i> 大事记</Button> : null}
                    </div>
                    <div className="cart-item-container">
                      {menu.includes('1-3') ? <Button type="link" onClick={() => handleGoToDetails('22')}><i></i> 急救预案</Button> : null}
                      {menu.includes('1-4') ? <Button type="link" style={{ width: '120px', textAlign: 'left' }} onClick={() => handleGoToDetails('23')}><i></i> 保健计划</Button> : null}
                    </div>
                    <div className="cart-item-container">
                      {menu.includes('1-5') ? <Button type="link" onClick={() => handleGoToDetails('24')}><i></i> 病历记录</Button> : null}
                      {menu.includes('1-6') ? <Button type="link" style={{ width: '120px', textAlign: 'left' }} onClick={() => handleGoToDetails('25')}><i></i> 病情总结</Button> : null}
                    </div>
                    <div className="cart-item-container">
                      {menu.includes('1-7') ? <Button type="link" onClick={() => handleGoToDetails('26')}><i></i> 访视观察</Button> : null}
                      {menu.includes('1-8') ? <Button type="link" style={{ width: '120px', textAlign: 'left' }} onClick={() => handleGoToDetails('27')}><i></i> 出诊记录单</Button> : null}
                    </div>
                  </Card>
                </Col>
                <Col md={12} xl={8} className="card-item">
                  <Card size="small" headStyle={{ backgroundColor: 'rgb(102, 177, 255)', color: '#fff' }} title="快速索引">
                    <div className="cart-item-container last">
                      {menu.includes('2-0') ? <Button type="link" onClick={() => handleGoToDoctorAdvice()}><i></i> 医嘱</Button> : null}
                      {menu.includes('3-0') ? <Button type="link" onClick={() => handleGoToConsultation()}><i></i> 会诊</Button> : null}
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </div> : <div style={{ color: '#ccc' }}>请选择左边委托人查看详情</div>
      }
    </div>
  )
}

export default connect((state) => state.user, { addTag })(withRouter(DatailsInfo));
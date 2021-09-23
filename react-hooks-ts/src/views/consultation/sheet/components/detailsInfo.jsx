import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  message
} from "antd";
import { connect } from "react-redux";
import { addTag } from "@/store/actions";
import { Context } from "../index";
import { getExpertInfo, updateExpert } from "@/api/consultation";

const { TextArea } = Input;
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
    const result = await getExpertInfo({ id });
    const details = result.data;
    form.setFieldsValue({ ...details });
  }

  const onFinish = async (values) => {
    const { id } = chareData;
    const result = await updateExpert({ ...values, id });
    if (result) {
      message.success('修改成功！');
    }
  }

  const handleLinkSheet = () => {
    const menuObj = {
      path: '/consultation/list',
      title: '会诊记录'
    }
    addTag(menuObj);
    history.push({
      pathname: '/consultation/list',
      state: { id: chareData.id }
    });
  }

  return (
    <div className="details-info-container">
      {/* {chareData.doctor_id} */}
      <Title level={2} className="details-title">专家信息</Title>
      {
        chareData.id ?
          <div className="details-content">
            <Form
              layout="inline"
              form={form}
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="专家名称：" name="name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="专家专业：" name="major">
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="机构名称：" name="organization">
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="会诊地点：" name="place">
                    <Input />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Form.Item label="专家介绍：" name="introduce">
                    <TextArea rows={6} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Form.Item label="备注信息：" name="remarks">
                    <TextArea rows={6} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">保存信息</Button>
                    <Button type="default" style={{ marginLeft: '20px' }} onClick={handleLinkSheet}>会诊记录</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div> : null
      }
    </div>
  )
}

export default connect((state) => state.user, { addTag })(withRouter(DatailsInfo));
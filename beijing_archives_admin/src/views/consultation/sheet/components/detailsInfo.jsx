import React, { useState, useRef, useEffect, useContext } from 'react';
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

const DatailsInfo = ({ updateTable }) => {
  const [divScrollY, setDivScrollY] = useState(0);
  const { chareData } = useContext(Context);
  const [form] = Form.useForm();
  const containerInfoRef = useRef(null);

  useEffect(() => {
    console.log('------重新获取信息');
    chareData.id && getInfo();
  }, [chareData]);

  useEffect(() => {
    setDivScrollY(containerInfoRef.current.clientHeight - 130);
  }, []);

  const getInfo = async () => {
    const { id } = chareData;
    const result = await getExpertInfo({ id });
    const details = result.data;
    form.setFieldsValue({ ...details });
  }

  const onFinish = async (values) => {
    values.name = values.name.replace(/^\s+|\s+$/g, "");
    values.major = values.major.replace(/^\s+|\s+$/g, "");
    if (!values.name || !values.major) {
      message.error('名称或者专业不能为空！')
      return
    }

    const { id } = chareData;
    const result = await updateExpert({ ...values, id });
    if (result) {
      message.success('修改成功！');
      updateTable();
    }
  }

  return (
    <div className="details-info-container" ref={containerInfoRef}>
      {
        chareData.id ?
          <div className="details-content">
            <Title level={2} className="details-title">专家信息</Title>
            <Form
              layout="inline"
              form={form}
              onFinish={onFinish}
            >
              <Row gutter={16} className="expert-info-row" style={{ maxHeight: `${divScrollY}px`, overflow: 'auto', borderTop: '1px solid #eee' }}>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="专家名称：" name="name">
                    <Input placeholder="请输入专家名称" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="专业：" name="major">
                    <Input placeholder="请输入专业" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item label="机构名称：" name="organization">
                    <Input placeholder="请输入机构名称" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Form.Item label="专家介绍：" name="introduce">
                    <TextArea placeholder="请输入专家介绍" autoSize={{ minRows: 5 }} />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Form.Item label="备注信息：" name="remarks">
                    <TextArea placeholder="请输入备注信息" autoSize={{ minRows: 5 }} />
                  </Form.Item>
                </Col>
              </Row>

              <div className="save-information-btn">
                <Form.Item>
                  <Button type="primary" htmlType="submit">保存信息</Button>
                </Form.Item>
              </div>
            </Form>
          </div> : <div style={{ color: '#ccc' }}>请选择左边专家查看详情</div>
      }
    </div>
  )
}

export default connect((state) => state.user, { addTag })(withRouter(DatailsInfo));
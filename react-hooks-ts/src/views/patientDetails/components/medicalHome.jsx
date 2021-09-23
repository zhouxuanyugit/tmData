import React, { useState, useEffect } from 'react';
import {
  Timeline,
  Button,
  Typography,
  Form,
  Input,
  message,
  Spin
} from 'antd';
import { getPatientInfo, updatePatientInfo } from "@/api/patient";
import { getMedicalHomeInfo, updateMedicalHomeInfo } from "@/api/patientDetails";

const { Title } = Typography;
const { TextArea } = Input;

const RENDERLIST = ['过敏史', '传染病史', '家族史', '长期居住地', '生活习惯或嗜好', '婚姻史', '主要诊断'];
const RENDERLISTFIELD = ['allergy_history', 'contagion_history', 'family_history', 'long_house', 'life', 'marry_history', 'main_diagnosis'];

/** 病案首页 */
const MedicalHome = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const baseInfo = await getPatientInfo({ id: parseInt(id) });
    const renderInfo = await getMedicalHomeInfo({ patient_id: parseInt(id) });
    const baseInfoData = baseInfo.data;
    const renderInfoData = renderInfo.data;
    form.setFieldsValue({ ...baseInfoData, ...renderInfoData });
    setLoading(false);
  }

  const onFinish = async (values) => {
    const {
      code,
      sex,
      height,
      nation,
      weight,
      blood,
      is_marry,
      native_place,
      birthday,
      birth_address,

      allergy_history,
      contagion_history,
      family_history,
      long_house,
      life,
      marry_history,
      main_diagnosis
    } = values;
    const baseResult = await updatePatientInfo({ id: parseInt(id), code, sex, height, nation, weight, blood, is_marry, native_place, birthday, birth_address });
    const renderResult = await updateMedicalHomeInfo({ patient_id: parseInt(id), allergy_history, contagion_history, family_history, long_house, life, marry_history, main_diagnosis });
    if (baseResult && renderResult) {
      message.success('修改成功！');
      setIsReview(false);
    }
  }
  const print = () => {
    let iframe = document.getElementById("print-iframe");
    if (iframe) {
      document.body.removeChild(iframe);
    }
    iframe = document.createElement('IFRAME');
    iframe.setAttribute("id", "print-iframe");
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    let doc = iframe.contentWindow.document;
    doc.write(`<div>${document.getElementById('print').innerHTML}</div>`); //<style media="print">@page{margin: 0 auto}</style>
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
  const review = () => {
    setIsReview(!isReview);
  }
  const scrollToAnchor = (anchorName) => {
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    }
  }
  return (
    <div className="health-doc-container">
      <div className="catelog">
        <Timeline>
          <Timeline.Item>
            <a onClick={() => scrollToAnchor('catelog1')}>基本信息</a>
          </Timeline.Item>
          {
            RENDERLIST.map((item, index) => {
              return (
                <Timeline.Item key={index}>
                  <a onClick={() => scrollToAnchor(`catelog${index + 2}`)}>{item}</a>
                </Timeline.Item>
              )
            })
          }
        </Timeline>
      </div>
      <div className="content">
        <div>
          <Form
            className="content-form"
            form={form}
            onFinish={onFinish}
          >
            <div className="btns">
              <Button type="primary" className="btn" htmlType="submit">
                保存
              </Button>
              <Button type="primary" className="btn" onClick={print}>
                打印
              </Button>
              <Button type="primary" className="btn" onClick={review}>
                {isReview ? '取消预览' : '预览'}
              </Button>
            </div>
            <Spin spinning={loading} wrapperClassName="print-content">
              {/* 以下为需要打印内容，所以用内联样式，麻烦哦 */}
              <div id="print" className="print-content">
                <Title level={3} style={{ textAlign: 'center' }} id="catelog1">病案首页</Title>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '20%' }}><span>301医院：</span></div>
                  <div style={{ width: '20%' }}><span>协和医院：</span></div>
                  <div style={{ width: '20%' }}><span>北京医院：</span></div>
                </div>
                <div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>代号：</label>
                      <Form.Item name="code" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>性别：</label>
                      <Form.Item name="sex" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <select disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderColor: '#d9d9d9' }} >
                          <option value={1}>男</option>
                          <option value={2}>女</option>
                        </select>
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>身高：</label>
                      <Form.Item name="height" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                      CM
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>民族：</label>
                      <Form.Item name="nation" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>体重：</label>
                      <Form.Item name="weight" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                      Kg
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>血型：</label>
                      <Form.Item name="blood" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                      型
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>婚姻：</label>
                      <Form.Item name="is_marry" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>籍贯：</label>
                      <Form.Item name="native_place" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>出生日期：</label>
                      <Form.Item name="birthday" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>出生地：</label>
                      <Form.Item name="birth_address" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  {
                    RENDERLIST.map((item, index) => {
                      return (
                        <div style={{ marginTop: '10px' }} key={index}>
                          <div>
                            <label style={{ fontSize: '18px', fontWeight: '900' }} id={`catelog${index + 2}`}>{item}：</label>
                            <Form.Item name={RENDERLISTFIELD[index]} style={{ margin: '0' }}>
                              <TextArea disabled={isReview} autoSize={true} style={{ width: '100%', borderTop: 'none', borderLeft: 'none', borderRight: 'none', resize: 'none' }} />
                            </Form.Item>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </Spin>
          </Form>
        </div>
      </div>
    </div >
  )
}

export default MedicalHome;
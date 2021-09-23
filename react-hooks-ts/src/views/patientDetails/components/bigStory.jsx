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
import { getBigStoryInfo, updateBigStoryInfo } from "@/api/patientDetails";

const { Title } = Typography;
const { TextArea } = Input;

const RENDERLIST = ['既往史', '手术史及输血史', '婚姻及家族史', '目前主要疾病及确诊时间', '疾病主要诊断', '目前用药情况', '过敏史', '主要疾病诊疗经过',
  '心血管（循环）系统', '呼吸系统', '消化系统', '神经系统', '内分泌系统', '免疫系统', '血液系统', '运动系统', '泌尿生殖系统', '皮肤科', '耳鼻喉科', '口腔科',
  '眼科', '普外科', '骨科', '中医科', '其他'];

const RENDERLISTFIELD = ['history', 'operation_history', 'family_history', 'now_illness', 'illness_main_diagnosis', 'now_drug', 'allergy_history', 'now_illness_treatment',
  'cardiovascular', 'breathing', 'digestion', 'nerve', 'endocrine', 'immune', 'big_blood', 'motion', 'genitourinary', 'skin', 'otorhinolaryngology', 'mouth',
  'eye', 'general_surgery', 'bone', 'chinese_medicine', 'other'];

/** 大记事 */
const BigStory = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const baseInfo = await getPatientInfo({ id: parseInt(id) });
    const renderInfo = await getBigStoryInfo({ patient_id: parseInt(id) });
    const baseInfoData = baseInfo.data;
    const renderInfoData = renderInfo.data;
    form.setFieldsValue({ ...baseInfoData, ...renderInfoData });
    setLoading(false);
  }

  const onFinish = async (values) => {
    console.log(values);
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

      history, operation_history, family_history, now_illness, illness_main_diagnosis, now_drug, allergy_history, now_illness_treatment,
      cardiovascular, breathing, digestion, nerve, endocrine, immune, big_blood, motion, genitourinary, skin, otorhinolaryngology, mouth,
      eye, general_surgery, bone, chinese_medicine, other
    } = values;
    const baseResult = await updatePatientInfo({ id: parseInt(id), code, sex: parseInt(sex), height, nation, weight, blood, is_marry, native_place, birthday, birth_address });
    const renderResult = await updateBigStoryInfo({
      patient_id: parseInt(id),
      history, operation_history, family_history, now_illness, illness_main_diagnosis, now_drug, allergy_history, now_illness_treatment,
      cardiovascular, breathing, digestion, nerve, endocrine, immune, big_blood, motion, genitourinary, skin, otorhinolaryngology, mouth,
      eye, general_surgery, bone, chinese_medicine, other
    });
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
                <Title level={3} style={{ textAlign: 'center' }} id="catelog1">大记事</Title>
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

export default BigStory;
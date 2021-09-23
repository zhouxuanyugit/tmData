import React, { useState, useEffect } from 'react';
import {
  DatePicker,
  Button,
  Typography,
  Form,
  message,
  Input,
  Spin
} from 'antd';
import moment from 'moment';
import { getPatientInfo } from "@/api/patient";
import { getIllnessSumList, addIllnessSumPlan, getIllnessSumInfo, updateIllnessSumInfo } from "@/api/patientDetails";

const { Title } = Typography;
const { TextArea } = Input;
/** Note: antd form initialValues只有在初始化才生效，后面设置无效，需要手动设置才行 setFieldsValue, 其他模块也需要改*/
const formRef = React.createRef();

/** 病情总结 */
const IllnessSum = ({ id }) => {
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999 });
  const [itemList, setItemList] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  const [listLoading, setListLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setListLoading(true);
    const result = await getIllnessSumList({ ...listQuery, patient_id: parseInt(id) });
    setItemList(result.data.list);
    setListLoading(false);
  }

  const handleAdd = async () => {
    const baseResult = await getPatientInfo({ id: parseInt(id) });
    const baseData = baseResult.data;
    const addResult = await addIllnessSumPlan({ ...baseData, patient_id: parseInt(id), content: '', edit_time: moment().unix() });
    if (addResult) {
      message.success('添加成功！');
      fetchData();
    }
  }

  const onFinish = async (values) => {
    values.edit_time = moment(values.edit_time).unix();
    values.sex = parseInt(values.sex);
    const result = await updateIllnessSumInfo({ ...values, id: currentId });
    if (result) {
      message.success('修改成功！');
      setIsReview(false);
      fetchData();
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

  const handleClickItem = async (item, index) => {
    setCurrentId(item.id);
    setInfoLoading(true);
    const result = await getIllnessSumInfo({ id: item.id });
    const info = result.data;
    info.edit_time = moment(info.edit_time * 1000);
    formRef.current.setFieldsValue({
      ...info
    })
    setInfoLoading(false);
  }

  return (
    <div className="health-doc-container">
      <div className="catelog">
        <div>
          <Button type="primary" className="btn" onClick={handleAdd}>
            添加病情总结
          </Button>
        </div>
        <div className="list-container">
          <Spin spinning={listLoading}>
            {
              itemList.map((item, index) => {
                return (
                  <div
                    className={item.id === currentId ? "item active" : "item"}
                    key={index}
                  >
                    <div className="item-list" onClick={() => handleClickItem(item, index)}>{moment(item.edit_time * 1000).format('YYYY-MM-DD HH:mm:ss')} {item.sign_doctor}</div>
                  </div>
                )
              })
            }
          </Spin>
        </div>
      </div>
      <div className="content">
        <div style={{ visibility: currentId ? "visible" : "hidden" }}>
          <Form
            className="content-form"
            ref={formRef}
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
            <Spin spinning={infoLoading} wrapperClassName="print-content">
              {/* 以下为需要打印内容，所以用内联样式，麻烦哦 */}
              <div id="print" className="print-content">
                <Title level={3} style={{ textAlign: 'center' }} id="catelog1">急救预案</Title>
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
                  <div style={{ marginTop: '10px' }}>
                    <div>
                      <Form.Item name="edit_time" style={{ margin: '0' }}>
                        <DatePicker disabled={isReview} showTime allowClear={false} suffixIcon={null} style={{ border: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div>
                      <Form.Item name="content" style={{ margin: '0' }}>
                        <TextArea disabled={isReview} autoSize={true} style={{ width: '100%', borderTop: 'none', borderLeft: 'none', borderRight: 'none', resize: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ marginTop: '10px', float: 'right' }}>
                    <div>
                      <label style={{ fontWeight: '900' }}>医生签名：</label>
                      <Form.Item name="sign_doctor" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }} >
                        <Input disabled={isReview} style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </Spin>
          </Form>
        </div>
      </div>
    </div >
  )
}

export default IllnessSum;
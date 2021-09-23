import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Form,
  message,
  Input,
  Spin
} from 'antd';
import moment from 'moment';
import { getVisitWatchList, addVisitWatchPlan, getVisitWatchInfo, updateVisitWatchInfo } from "@/api/patientDetails";

const { Title } = Typography;
const { TextArea } = Input;

const RENDERLIST = ['访视内容', '身体状况', '心理状态', '辅助检查', '初步诊断', '特殊意见', '处置'];
const RENDERLISTFIELD = ['visit_content', 'body', 'psychology', 'assist_check', 'primary_diagnosis', 'special_opinion', 'handle'];
/** Note: antd form initialValues只有在初始化才生效，后面设置无效，需要手动设置才行 setFieldsValue, 其他模块也需要改*/
const formRef = React.createRef();

/** 访视观察 */
const VisitWatch = ({ id }) => {
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
    const result = await getVisitWatchList({ ...listQuery, patient_id: parseInt(id) });
    setItemList(result.data.list);
    setListLoading(false);
  }

  const handleAdd = async () => {
    const addResult = await addVisitWatchPlan({
      patient_id: parseInt(id),
      visit_time: '',
      visit_address: '',
      arrive_time: '',
      visit_reason: '',
      visit_content: '',
      body: '',
      psychology: '',
      assist_check: '',
      primary_diagnosis: '',
      special_opinion: '',
      handle: '',
      life_surface: ''
    });
    if (addResult) {
      message.success('添加成功！');
      fetchData();
    }
  }

  const onFinish = async (values) => {
    const result = await updateVisitWatchInfo({ ...values, id: currentId });
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
    const result = await getVisitWatchInfo({ id: item.id });
    const info = result.data;
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
            添加访视观察
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
                    <div className="item-list" onClick={() => handleClickItem(item, index)}>{moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')} {item.sign_doctor}</div>
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
                <Title level={3} style={{ textAlign: 'center' }} id="catelog1">访视观察</Title>
                <div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>访视时间：</label>
                      <Form.Item name="visit_time" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>访视地点：</label>
                      <Form.Item name="visit_address" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>到达时间：</label>
                      <Form.Item name="arrive_time" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>访视原因：</label>
                      <Form.Item name="visit_reason" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input disabled={isReview} style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                      </Form.Item>
                    </div>
                  </div>
                  <hr />
                  {
                    RENDERLIST.map((item, index) => {
                      return (
                        <div style={{ marginTop: '10px' }} key={index}>
                          <div>
                            <label style={{ fontSize: '18px', fontWeight: '900' }}>{item}：</label>
                            <Form.Item name={RENDERLISTFIELD[index]} style={{ margin: '0' }}>
                              <TextArea disabled={isReview} autoSize={true} style={{ width: '100%', borderTop: 'none', borderLeft: 'none', borderRight: 'none', resize: 'none' }} />
                            </Form.Item>
                          </div>
                        </div>
                      )
                    })
                  }
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

export default VisitWatch;
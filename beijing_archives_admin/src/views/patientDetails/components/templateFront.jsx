/** 健康档案首页，病案首页，大记事 模板 */
import React, { useState, useEffect } from 'react';
import {
  Timeline,
  Button,
  Typography,
  Form,
  Input,
  message,
  Spin,
  Select,
  Cascader,
  DatePicker,
  Tooltip
} from 'antd';
import { connect } from "react-redux";
import moment from "moment";
import {
  PrinterOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";
import { getLocalStorage } from "@/utils/auth";
import { Editor } from '@tinymce/tinymce-react';
import { getPatientInfo, updatePatientInfo } from "@/api/patient";
import { decryption } from "@/utils/secret";
import { CITY_DATA, UPLOADFILEURL, EDITORAPIKEY, HOSTPRO } from "@/utils/constants";
import { throttle } from "@/utils";

const { Title } = Typography;
const { Option } = Select;

const TemplateFront = ({
  getInfo,
  updateInfo,
  renderList,
  renderListField,
  renderListFieldDataDefult,
  anchorIds,
  token,
  domainUrl,
  id
}) => {
  const [renderListFieldData, setRenderListFieldData] = useState({ ...renderListFieldDataDefult });
  const [scrollAnchorId, setScrollAnchorId] = useState('catelog1');
  const [loading, setLoading] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
    function scrollContent() {
      let scrollTop = this.scrollTop;
      for (let i = anchorIds.length - 1; i > -1; i--) {
        if (scrollTop + 10 >= document.getElementById(anchorIds[i]).offsetTop) {
          setScrollAnchorId(`${anchorIds[i]}`);
          break;
        }
      }
    }
    document.getElementById("printContent").addEventListener("scroll", throttle(scrollContent, 100));
    return () => {
      document.getElementById("printContent").removeEventListener("scroll", scrollContent);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const baseInfo = await getPatientInfo({ id: parseInt(id) });
    const renderInfo = await getInfo({ patient_id: parseInt(id) });
    // 基本信息
    const baseInfoData = baseInfo.data;
    baseInfoData.birthday = baseInfoData.birthday ? moment(baseInfoData.birthday) : '';
    baseInfoData.native_place = baseInfoData.native_place ? baseInfoData.native_place.split(',') : '';  // 籍贯
    baseInfoData.birth_address = baseInfoData.birth_address ? baseInfoData.birth_address.split(',') : '';  //出身地
    // 其他信息
    const renderInfoData = renderInfo.data;
    Object.keys(renderListFieldData).map((key) => {
      renderInfoData[key] && (renderListFieldData[key] = renderInfoData[key]);
      setRenderListFieldData({ ...renderListFieldData });
    });

    form.setFieldsValue({
      ...baseInfoData,
      hospital1: renderInfoData.hospital1,
      hospital2: renderInfoData.hospital2,
      hospital3: renderInfoData.hospital3,
    });
    setLoading(false);
  }

  const handleEditorChange = (content, editor, key) => {
    const renderListFieldDataCopy = { ...renderListFieldData };
    renderListFieldDataCopy[key] = content;
    setRenderListFieldData(renderListFieldDataCopy);
  }

  const onFinish = async (values) => {
    values.native_place = values.native_place ? values.native_place.join(',') : '';
    values.birth_address = values.birth_address ? values.birth_address.join(',') : '';
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
      detail_address,

      hospital1,
      hospital2,
      hospital3
    } = values;
    setLoading(true);
    try {
      const baseResult = await updatePatientInfo({ id: parseInt(id), code, sex: parseInt(sex), height, nation, weight, blood, is_marry, native_place, birthday, birth_address, detail_address });
      const renderResult = await updateInfo({ patient_id: parseInt(id), ...renderListFieldData, hospital1, hospital2, hospital3 });
      baseResult && renderResult && message.success('修改成功！');
    } catch (error) {

    } finally {
      setIsReview(false);
      setLoading(false);
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

    let otherHtml = '' // 重新组装其他档案字段打印
    renderListField.forEach((item, index) => {
      otherHtml += `<div style="margin-top: 20px"><label style="font-size: 18px; font-weight: 900">${renderList[index]}：</label><div>${renderListFieldData[item]}</div></div>`
    })

    doc.write(`<div>${document.getElementById('print').innerHTML} ${otherHtml}
    <style media="print">
    @media print {
      .ant-select-arrow {display: none}
      .ant-select-selection-search {display: none}
      .ant-cascader-input, .ant-cascader-picker-arrow, .ant-picker-suffix {display: none}
      #birthday {border: none}
      img {max-width: 100%}
    }
    </style> </div>`); //<style media="print">@page{margin: 0 auto}</style>
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }
  const review = () => {
    setIsReview(!isReview);
  }
  const scrollToAnchor = (anchorName) => {
    setScrollAnchorId(anchorName);
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }
  return (
    <div className="health-doc-container">
      <div className="catelog">
        <Title level={5}>健康档案首页</Title>
        <Timeline className="anchor-list-item">
          <Timeline.Item>
            <Button
              type="link"
              className={`${scrollAnchorId === 'catelog1' ? 'active' : 'adf'}`}
              onClick={() => scrollToAnchor('catelog1')}
            >
              基本信息
            </Button>
          </Timeline.Item>
          {
            renderList.map((item, index) => {
              return (
                <Timeline.Item key={index}>
                  <Button
                    type="link"
                    className={`${scrollAnchorId === `catelog${index + 2}` ? 'active' : ''}`}
                    onClick={() => scrollToAnchor(`catelog${index + 2}`)}
                  >
                    {item}
                  </Button>
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
              <Button type="link" className="" onClick={review}>
                {
                  isReview ?
                    <Tooltip placement="bottom" title="取消预览">
                      <EyeInvisibleOutlined />
                    </Tooltip> :
                    <Tooltip placement="bottom" title="预览">
                      <EyeOutlined />
                    </Tooltip>
                }
              </Button>
              <Button type="link" className="" onClick={print}>
                <Tooltip placement="bottom" title="打印">
                  <PrinterOutlined />
                </Tooltip>
              </Button>
              <Button type="primary" ghost className="btn" htmlType="submit">
                保存
              </Button>
            </div>
            <Spin spinning={loading} wrapperClassName="print-content" id="printContent">
              {/* 以下为需要打印内容，所以用内联样式，麻烦哦 */}
              <div id="print" className="">
                <Title level={4} style={{ textAlign: 'center' }} id="catelog1">健康档案首页</Title>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '33%' }}>
                    <Form.Item name="hospital1" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0', width: '100%' }}>
                      <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} disabled={isReview} style={{ width: '90%', border: 'none', padding: '0', fontSize: '12px', resize: 'none'}} bordered={false} maxLength={30} placeholder="301医院：" />
                    </Form.Item>
                  </div>
                  <div style={{ width: '33%' }}>
                    <Form.Item name="hospital2" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0', width: '100%' }}>
                      <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} disabled={isReview} style={{ width: '90%', border: 'none', padding: '0', fontSize: '12px', resize: 'none' }} bordered={false} maxLength={30} placeholder="协和医院：" />
                    </Form.Item>
                  </div>
                  <div style={{ width: '33%' }}>
                    <Form.Item name="hospital3" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0', width: '100%' }}>
                      <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} disabled={isReview} style={{ width: '90%', border: 'none', padding: '0', fontSize: '12px', resize: 'none' }} bordered={false} maxLength={30} placeholder="北京医院：" />
                    </Form.Item>
                  </div>
                </div>
                <hr />
                <div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>代号：</label>
                      <Form.Item name="code" rules={[{ required: true, message: '代号不能为空' }]} style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input
                          disabled={isReview}
                          maxLength={6}
                          style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                          bordered={false}
                        />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>性别：</label>
                      <Form.Item name="sex" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Select getPopupContainer={triggerNode => triggerNode.parentElement} disabled={isReview} style={{ width: '100px', borderBottom: '1px solid #d9d9d9' }} bordered={false}>
                          <Option value={1}>男</Option>
                          <Option value={2}>女</Option>
                          <Option value={3}>保密</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>身高：</label>
                      <Form.Item name="height" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }} getValueFromEvent={(event) => { return event.target.value.replace(/\D/g, '') }}>
                        <Input
                          disabled={isReview}
                          maxLength={4}
                          style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                          bordered={false}
                        />
                      </Form.Item>
                      CM
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>民族：</label>
                      <Form.Item name="nation" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input
                          disabled={isReview}
                          maxLength={5}
                          style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                          bordered={false}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>体重：</label>
                      <Form.Item name="weight" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }} getValueFromEvent={(event) => { return event.target.value.replace(/\D/g, '') }}>
                        <Input
                          disabled={isReview}
                          maxLength={4}
                          style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                          bordered={false}
                        />
                      </Form.Item>
                      Kg
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>血型：</label>
                      <Form.Item name="blood" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Select getPopupContainer={triggerNode => triggerNode.parentElement} disabled={isReview} style={{ width: '100px', borderBottom: '1px solid #d9d9d9' }} bordered={false}>
                          <Option value="A">A</Option>
                          <Option value="B">B</Option>
                          <Option value="AB">AB</Option>
                          <Option value="O">O</Option>
                          <Option value="5">保密</Option>
                        </Select>
                      </Form.Item>
                      型
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>婚姻：</label>
                      <Form.Item name="is_marry" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Select getPopupContainer={triggerNode => triggerNode.parentElement} disabled={isReview} style={{ width: '100px', borderBottom: '1px solid #d9d9d9' }} bordered={false}>
                          <Option value="1">未婚</Option>
                          <Option value="2">已婚</Option>
                          <Option value="3">离异</Option>
                          <Option value="4">丧偶</Option>
                          <Option value="5">保密</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>籍贯：</label>
                      <Form.Item name="native_place" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Cascader
                          options={CITY_DATA}
                          disabled={isReview}
                          allowClear={false}
                          bordered={false}
                          placeholder=""
                          getPopupContainer={triggerNode => triggerNode.parentElement}
                          style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '50%' }}>
                      <label>出生日期：</label>
                      <Form.Item name="birthday" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <DatePicker
                          disabled={isReview}
                          picker="month"
                          allowClear={false}
                          placeholder=""
                          getPopupContainer={triggerNode => triggerNode.parentElement}
                          style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                        />
                      </Form.Item>
                    </div>
                    <div style={{ width: '50%' }}>
                      <label>出生地：</label>
                      <Form.Item name="birth_address" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Cascader
                          options={CITY_DATA}
                          disabled={isReview}
                          allowClear={false}
                          bordered={false}
                          placeholder=""
                          getPopupContainer={triggerNode => triggerNode.parentElement}
                          style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '100%' }}>
                      <label>详细地址：</label>
                      <Form.Item name="detail_address" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                        <Input
                          disabled={isReview}
                          style={{ width: '600px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                          bordered={false}
                          maxLength={40}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
              {
                renderList.map((item, index) => {
                  return (
                    <div style={{ marginTop: '30px' }} key={index}>
                      <div>
                        <label style={{ fontSize: '18px', fontWeight: '900' }} id={`catelog${index + 2}`}>{item}：</label>
                        <Form.Item style={{ marginTop: '20px' }}>
                          <Editor
                            inline={false}
                            selector='editorStateRef'
                            apiKey={EDITORAPIKEY}
                            value={renderListFieldData[renderListField[index]]}
                            disabled={isReview}
                            onEditorChange={(content, editor) => handleEditorChange(content, editor, renderListField[index])}
                            init={{
                              min_height: 200,
                              language: 'zh_CN',
                              plugins: 'table image fullscreen autoresize paste',
                              toolbar: `table image fullscreen`,
                              branding: false,
                              elementpath: false,
                              inline: true,
                              menubar: false,
                              statusbar: false,
                              content_style: "p {margin: 0}",
                              paste_preprocess: function (plugin, args) {
                                if (args.content.includes('data:image')) {
                                  message.info('禁止复制图片，只能上传')
                                  args.content = '';
                                }
                              },
                              images_upload_handler: function (blobInfo, succFun, failFun) {
                                let xhr, formData;
                                let file = blobInfo.blob();//转化为易于理解的file对象
                                xhr = new XMLHttpRequest();
                                xhr.withCredentials = false;
                                xhr.open('POST', UPLOADFILEURL);
                                xhr.setRequestHeader('token', token);
                                xhr.setRequestHeader('authcode', getLocalStorage('authCode'));
                                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                                xhr.onload = function () {
                                  let json;
                                  if (xhr.status != 200) {
                                    failFun('HTTP Error: ' + xhr.status);
                                    return;
                                  }
                                  json = JSON.parse(xhr.responseText);
                                  if (!json || json.code !== 200) {
                                    failFun('Invalid JSON: ' + xhr.responseText);
                                    return;
                                  }
                                  const { url } = HOSTPRO ? decryption(json.data) : json.data;
                                  succFun(`${domainUrl}${window.atob(url)}`);
                                };
                                formData = new FormData();
                                formData.append('myfile', file, file.name);
                                xhr.send(formData);
                              }
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  )
                })
              }
            </Spin>
          </Form>
        </div>
      </div>
    </div >
  )
}

export default connect((state) => state.user, null)(TemplateFront);
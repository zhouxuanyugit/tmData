/** 急救预案，保健计划，病历记录，病情总结模板 */
import React, { useState, useEffect } from 'react';
import {
  DatePicker,
  Button,
  Typography,
  Form,
  message,
  Input,
  Spin,
  Select,
  Modal,
  Cascader,
  Tooltip
} from 'antd';
import {
  ExclamationCircleOutlined,
  PrinterOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import moment from 'moment';
import { connect } from "react-redux";
import { getLocalStorage } from "@/utils/auth";
import { Editor } from '@tinymce/tinymce-react';
import { decryption } from "@/utils/secret";
import { CITY_DATA, UPLOADFILEURL, EDITORAPIKEY, HOSTPRO } from "@/utils/constants";
import AddEditModal from "./addEditModal";
import { getPatientInfo } from "@/api/patient";

const { Title } = Typography;
const { Option } = Select;
/** Note: antd form initialValues只有在初始化才生效，后面设置无效，需要手动设置才行 setFieldsValue, 其他模块也需要改*/
const formRef = React.createRef();
const editorRef = React.createRef();

const TemplateMiddle = ({
  title,
  getList,
  addInfo,
  getInfo,
  updateInfo,
  deleteInfo,
  token,
  name,
  domainUrl,
  id
}) => {
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999 });
  const [itemList, setItemList] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const [currentItem, setCurrentItem] = useState({});  // 选中列表对象数据
  const [contentValue, setContentValue] = useState('');  // 富文本编辑框内容

  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [addEditData, setAddEditData] = useState({});
  const [addEditModalLoading, setAddEditModalLoading] = useState(false);

  const [listLoading, setListLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * 获取列表数据
   * @param {*} newId 新加列表项的时候需要自动选中
   */
  const fetchData = async (newId) => {
    setListLoading(true);
    const result = await getList({ ...listQuery, patient_id: parseInt(id) });
    setItemList(result.data.list);
    setListLoading(false);

    // 当选中一项后添加会自动选中到添加的这项
    if (newId) {
      const newItem = result.data.list.find((ele) => ele.id === newId);

      if (newItem) {
        handleClickItem(newItem);
        setTimeout(() => {
          editorRef.current.editor.editorManager.get('editorId').focus();
        }, 50);
      }
    }
  }

  /**
   * 添加列表数据，有两种情况
   * 1：当前已经有正在编辑的内容时候
   * 2：当前还没有选中列表
   */
  const handleAdd = () => {
    if (currentItem?.id) {
      Modal.confirm({
        title: <div>是否保存当前编辑的内容？</div>,
        icon: <ExclamationCircleOutlined />,
        okText: '保存',
        cancelText: '不保存',
        onOk: async () => {
          const formValues = JSON.parse(JSON.stringify(formRef.current.getFieldsValue(true)));
          formValues.native_place = formValues.native_place ? formValues.native_place.join(',') : '';
          formValues.birth_address = formValues.birth_address ? formValues.birth_address.join(',') : '';
          formValues.edit_time = moment(formValues.edit_time).unix();
          formValues.sex = parseInt(formValues.sex);
          formValues.content = contentValue;
          const result = await updateInfo({ ...formValues, id: currentItem.id, patient_id: currentItem.patient_id, title: currentItem.title });
          if (result) {
            message.success('修改成功！');
            setIsReview(false);
            setAddEditData({});
            setAddEditModalVisible(true);
            fetchData();
          }
        },
        onCancel: () => {
          setAddEditData({});
          setAddEditModalVisible(true);
        }
      });
    } else {
      setAddEditData({});
      setAddEditModalVisible(true);
    }
  }

  /**
   * 点击保存按钮保存信息
   * @param {*} values form表单数据 
   */
  const onFinish = async (values) => {
    values.native_place = values.native_place ? values.native_place.join(',') : '';
    values.birth_address = values.native_place ? values.birth_address.join(',') : '';
    values.edit_time = moment(values.edit_time).unix();
    values.sex = parseInt(values.sex);
    values.content = contentValue;
    const result = await updateInfo({ ...values, id: currentItem.id, patient_id: currentItem.patient_id, title: currentItem.title });
    if (result) {
      message.success('修改成功！');
      setIsReview(false);
      fetchData();
    }
  }

  /**
   * 点击打印按钮
   */
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
    otherHtml += `<div style="margin-top: 20px"><div>${contentValue}</div></div>
     <div style="margin-top: 30px; float: right;"><label style="font-weight: 900">医生签名：</label><span>${formRef.current.getFieldsValue(['sign_doctor']).sign_doctor}</span></div>`

    doc.write(`<div>${document.getElementById('print').innerHTML} ${otherHtml}
     <style media="print">
     @media print {
       .ant-select-arrow {display: none}
       .ant-select-selection-search {display: none}
       .ant-cascader-input, .ant-cascader-picker-arrow, .ant-picker-suffix {display: none}
       #birthday {border: none}
       #edit_time {border: none}
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

  /**
   * 点击某项 获取详细信息
   * @param {*} item 列表详情信息
   * @param {*} index 
   */
  const handleClickItem = async (item, index) => {
    setCurrentItem(item);
    setInfoLoading(true);
    const result = await getInfo({ id: item.id });
    const info = result.data;

    info.birthday = info.birthday ? moment(info.birthday) : '';
    info.native_place = info.native_place ? info.native_place.split(',') : '';  // 籍贯
    info.birth_address = info.birth_address ? info.birth_address.split(',') : '';  //出身地
    info.edit_time = moment(info.edit_time * 1000);
    formRef.current.setFieldsValue({
      ...info
    })
    setContentValue(info.content);
    setInfoLoading(false);
  }

  const handleEdit = () => {
    setAddEditData(currentItem);
    setAddEditModalVisible(true);
  }

  const handleAddEditCancel = () => {
    setAddEditModalVisible(false);
  }

  const handleAddEditOk = async (values) => {
    setAddEditModalLoading(true);
    const { title } = values;
    if (values.id) {
      const result = await updateInfo({ title, id: parseInt(values.id) });
      if (result) {
        message.success('修改成功！');
        setAddEditModalVisible(false);
        setAddEditModalLoading(false);
        setCurrentItem({ ...currentItem, title }); //  把当前选中title实时变化，以防马上再修改标题获取不到最新的
        fetchData();
      }
    } else {
      const baseResult = await getPatientInfo({ id: parseInt(id) });
      const baseData = baseResult.data;
      const addResult = await addInfo({
        ...baseData,
        patient_id: parseInt(id),
        content: '',
        edit_time: moment().unix(),
        hospital1: '',
        hospital2: '',
        hospital3: '',
        title,
        sign_doctor: name
      });
      if (addResult) {
        message.success('添加成功！');
        setAddEditModalVisible(false);
        setAddEditModalLoading(false);
        fetchData(addResult.data);
      }
    }
  }

  const handleDelete = () => {
    Modal.confirm({
      title: <div>你确认要对 <span style={{ color: 'red' }}>{currentItem.title}</span> 进行删除？</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const { id } = currentItem;
        deleteInfo({ id }).then(() => {
          message.success(`删除成功`);
          setCurrentItem({});
          fetchData();
        })
      }
    });
  }

  const handleEditorChange = (content, editor) => {
    setContentValue(content);
  }

  return (
    <div className="health-doc-container">
      <div className="catelog">
        <div className="title-header">
          <Title level={5}>{title}</Title>
          <Button type="primary" className="btn" size="small" onClick={handleAdd}>
            + 添加
          </Button>
        </div>
        <div className="list-container">
          <Spin spinning={listLoading}>
            {
              itemList.map((item, index) => {
                return (
                  <div
                    className={item.id === currentItem.id ? "item active" : "item"}
                    key={index}
                  >
                    <div className="ant-timeline-item-head ant-timeline-item-head-blue"></div>
                    <div className="item-list" onClick={() => handleClickItem(item, index)}>
                      <span>{item.title}</span>
                      <br />
                      {moment(item.edit_time * 1000).format('YYYY-MM-DD')} {item.sign_doctor}
                    </div>
                  </div>
                )
              })
            }
          </Spin>
        </div>
      </div>
      <div className="content">
        <div>
          {
            currentItem?.id ?
              <Form
                className="content-form"
                ref={formRef}
                onFinish={onFinish}
              >
                <div className="btns">
                  <Button type="link" className="" onClick={handleDelete}>
                    <Tooltip placement="bottom" title="删除">
                      <DeleteOutlined />
                    </Tooltip>
                  </Button>
                  <Button type="link" className="" onClick={handleEdit}>
                    <Tooltip placement="bottom" title="修改标题">
                      <EditOutlined />
                    </Tooltip>
                  </Button>
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
                <Spin spinning={infoLoading} wrapperClassName="print-content">
                  {/* 以下为需要打印内容，所以用内联样式，麻烦哦 */}
                  <div id="print" className="print-content">
                    <Title level={3} style={{ textAlign: 'center' }} id="catelog1">急救预案</Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ width: '33%' }}>
                        <Form.Item name="hospital1" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0', width: '100%' }}>
                          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} disabled={isReview} style={{ width: '90%', border: 'none', padding: '0', fontSize: '12px', resize: 'none' }} bordered={false} maxLength={30} placeholder="301医院：" />
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
                              displayRender={label => label}
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
                      <div style={{ marginTop: '30px' }}>
                        <div>
                          <Form.Item name="edit_time" style={{ margin: '0' }}>
                            <DatePicker
                              disabled={isReview}
                              showTime
                              allowClear={false}
                              suffixIcon={null}
                              bordered={false}
                              getPopupContainer={triggerNode => triggerNode.parentElement}
                              style={{ width: '200px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <div>
                      <Form.Item style={{ margin: '0' }}>
                        <Editor
                          id="editorId"
                          ref={editorRef}
                          inline={false}
                          selector='editorStateRef'
                          apiKey={EDITORAPIKEY}
                          value={contentValue}
                          disabled={isReview}
                          onEditorChange={(content, editor) => handleEditorChange(content, editor)}
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
                  <div style={{ marginTop: '10px', float: 'right' }}>
                    <div>
                      <label style={{ fontWeight: '900' }}>医生签名：</label>
                      <Form.Item name="sign_doctor" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }} >
                        <Input
                          disabled={true}
                          style={{ width: '100px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                          bordered={false}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Spin>
              </Form> : <div style={{ color: '#ccc' }}>请选择左边列表查看详情</div>
          }

        </div>
      </div>
      {
        addEditModalVisible ?
          <AddEditModal
            title={title}
            addEditData={addEditData}
            visible={addEditModalVisible}
            confirmLoading={addEditModalLoading}
            onCancel={handleAddEditCancel}
            onOk={handleAddEditOk}
          /> : null
      }
    </div >
  )
}

export default connect((state) => state.user, null)(TemplateMiddle);
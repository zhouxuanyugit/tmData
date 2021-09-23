import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Form,
  message,
  Input,
  Spin,
  Modal,
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
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import { connect } from "react-redux";
import { getLocalStorage } from "@/utils/auth";
import { decryption } from "@/utils/secret";
import { UPLOADFILEURL, EDITORAPIKEY, HOSTPRO } from "@/utils/constants";
import {
  getVisitRecordList,
  addVisitRecordPlan,
  getVisitRecordInfo,
  updateVisitRecordInfo,
  deleteVisitRecordInfo
} from "@/api/patientDetails";
import AddEditModal from "./addEditModal";

const { Title } = Typography;

const RENDERLIST = ['当前情况', '既往史', '用药史', '过敏史', '处置', '生命体征记录表'];
const RENDERLISTFIELD = ['now_situation', 'history', 'drug_history', 'allergy_history', 'handle', 'life_surface'];
/** Note: antd form initialValues只有在初始化才生效，后面设置无效，需要手动设置才行 setFieldsValue, 其他模块也需要改*/
const formRef = React.createRef();

/** 出诊记录单 */
const VisitRecord = ({
  token,
  domainUrl,
  id
}) => {
  const [renderListFieldData, setRenderListFieldData] = useState({ now_situation: '', history: '', drug_history: '', allergy_history: '', handle: '', life_surface: '' });
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999 });
  const [itemList, setItemList] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

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
    const result = await getVisitRecordList({ ...listQuery, patient_id: parseInt(id) });
    setItemList(result.data.list);
    setListLoading(false);

    // 当选中一项后添加会自动选中到添加的这项
    if (newId) {
      const newItem = result.data.list.find((ele) => ele.id === newId);

      if (newItem) {
        handleClickItem(newItem);
      }
    }
  }

  /**
   * 添加列表数据，有两种情况
   * 1：当前已经有正在编辑的内容时候
   * 2：当前还没有选中列表
   */
  const handleAdd = async () => {
    if (currentItem?.id) {
      Modal.confirm({
        title: <div>是否保存当前编辑的内容？</div>,
        icon: <ExclamationCircleOutlined />,
        okText: '保存',
        cancelText: '不保存',
        onOk: async () => {
          const formValues = JSON.parse(JSON.stringify(formRef.current.getFieldsValue(true)));

          const result = await updateVisitRecordInfo({ ...formValues, ...renderListFieldData, id: currentItem.id, patient_id: currentItem.patient_id, title: currentItem.title });
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
    const result = await updateVisitRecordInfo({
      ...values,
      ...renderListFieldData,
      id: currentItem.id, patient_id: currentItem.patient_id, title: currentItem.title
    });
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

    let otherHtml = '' // 重新组装其他档案字段打印
    RENDERLISTFIELD.forEach((item, index) => {
      otherHtml += `<div style="margin-top: 20px"><label style="font-size: 18px; font-weight: 900">${RENDERLIST[index]}：</label><div>${renderListFieldData[item]}</div></div>`
    })

    doc.write(
      `<div>${document.getElementById('print1').innerHTML} ${otherHtml}${document.getElementById('print3').innerHTML}</div>`
    ); //<style media="print">@page{margin: 0 auto}</style>
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
    const result = await getVisitRecordInfo({ id: item.id });
    const infoData = result.data;

    // 赋值富文本
    const defaultValue = { now_situation: '', history: '', drug_history: '', allergy_history: '', handle: '', life_surface: '' }
    Object.keys(defaultValue).map((key) => {
      infoData[key] && (defaultValue[key] = infoData[key]);
    });
    setRenderListFieldData({ ...defaultValue });

    formRef.current.setFieldsValue({
      ...infoData
    })
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
      const result = await updateVisitRecordInfo({ title, id: parseInt(values.id) });
      if (result) {
        message.success('修改成功！');
        setAddEditModalVisible(false);
        setAddEditModalLoading(false);
        setCurrentItem({ ...currentItem, title }); //  把当前选中title实时变化，以防马上再修改标题获取不到最新的
        fetchData();
      }
    } else {
      const addResult = await addVisitRecordPlan({
        patient_id: parseInt(id),
        title,
        visit_time: '',
        to_time: '',
        from_address: '',
        visit_reason: '',
        now_situation:
          `
        1、主诉及发生的时间：<br />
        2、发作最长持续时间：<br />
        3、现有症状：<br />
        畏寒：【否】；发热：【否】；鼻塞：【否】；流涕：【否】；咳嗽：【否】；咯血：【否】；咳痰：【粉红色泡沫痰】；<br />
        头胀：【否】；头晕：【否】；头痛：           ；眩晕：           ；偏瘫：【失语】；麻木：       ；抽搐：      ；意识：        ；<br />
        胸闷：           ；气短：【否】；呼吸困难：【夜间】；憋喘：【否】；胸痛：【否】；<br />
        食欲不振：【否】；反酸：【否】；暖气：【否】；恶心：【否】；烧心：【否】；便秘：【否】；呕吐：【否】；腹胀：【否】；腹痛：【否】；腹泻：【否】；呕血：【无】；便血：【柏油样】；
        里急后重：【否】；<br />
        尿频：【否】；次数：        ；尿急：【否】；尿痛：【否】；排尿困难：【否】；<br />
        皮疹：【否】；部位：        ；数量：           ；形状：           ；<br />
        外伤：           ；部位：        ；布局情况：        ；伴随症状：【晕厥】；<br />
        需要清创缝合：【否】；<br />
        其他：<br />
        4、症状性质：<br />
        压榨性/压迫性/紧缩性：绞痛/锐痛//刺痛//烧灼痛；剧烈/轻微；阵法/持续；突发/渐进；无法描述；有无放射部位：<br />
        其他：<br />
        5、症状诱因：<br />
        深呼吸；按压；体位改变；进食后（饱餐）；饮酒；劳力性；运动后；运动中；<br />
        其他：<br />
        6、伴随症状：【辗转不安；出汗；苍白；发绀；发力】<br />
        7、此次症状与以往比较：【相识】<br />
        8、辅助检查：<br /><br /><br /><br />
        9、初步诊断：<br /><br /><br />
          `,
        history: '',
        drug_history: '',
        allergy_history: '',
        handle: '',
        life_surface:
          `
        <table style="border-collapse: collapse; width: 99.8927%;" border="1">
          <tbody>
            <tr>
              <td style="width: 10.872%;">时间</td>
              <td style="width: 10.9626%;">T（℃）</td>
              <td style="width: 10.9626%;">HR（次/分）</td>
              <td style="width: 10.9626%;">R（次/分）</td>
              <td style="width: 10.9626%;">BP（mmHg）</td>
              <td style="width: 10.9626%;">SaO2（%）</td>
              <td style="width: 10.9626%;">体征</td>
            </tr>
            <tr>
              <td style="width: 10.872%;">&nbsp;</td>
              <td style="width: 10.9626%;">&nbsp;</td>
              <td style="width: 10.9626%;">&nbsp;</td>
              <td style="width: 10.9626%;">&nbsp;</td>
              <td style="width: 10.9626%;">&nbsp;</td>
              <td style="width: 10.9626%;">&nbsp;</td>
              <td style="width: 10.9626%;">&nbsp;</td>
            </tr>
          </tbody>
        </table>
          `
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
        deleteVisitRecordInfo({ id }).then(() => {
          message.success(`删除成功`);
          setCurrentItem({});
          fetchData();
        })
      }
    });
  }

  const handleEditorChange = (content, editor, key) => {
    const renderListFieldDataCopy = { ...renderListFieldData };
    renderListFieldDataCopy[key] = content;
    setRenderListFieldData(renderListFieldDataCopy);
  }

  return (
    <div className="health-doc-container">
      <div className="catelog">
        <div className="title-header">
          <Title level={5}>出诊记录单</Title>
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
                      {moment(item.create_time * 1000).format('YYYY-MM-DD')} {item.sign_doctor}
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
                  <div id="print1" className="print-content">
                    <Title level={3} style={{ textAlign: 'center' }} id="catelog1">出诊记录单</Title>
                    <div>
                      <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div style={{ width: '50%' }}>
                          <label>接诊时间：</label>
                          <Form.Item name="visit_time" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                            <Input
                              disabled={isReview}
                              style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                              bordered={false}
                            />
                          </Form.Item>
                        </div>
                        <div style={{ width: '50%' }}>
                          <label>到达时间：</label>
                          <Form.Item name="to_time" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                            <Input
                              disabled={isReview}
                              style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                              bordered={false}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div style={{ width: '50%' }}>
                          <label>出诊地点：</label>
                          <Form.Item name="from_address" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                            <Input
                              disabled={isReview}
                              style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                              bordered={false}
                            />
                          </Form.Item>
                        </div>
                        <div style={{ width: '50%' }}>
                          <label>出诊原因：</label>
                          <Form.Item name="visit_reason" style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0' }}>
                            <Input
                              disabled={isReview}
                              style={{ width: '250px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #d9d9d9' }}
                              bordered={false}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    RENDERLIST.map((item, index) => {
                      return (
                        <div style={{ marginTop: '30px' }} key={index}>
                          <div>
                            <label style={{ fontSize: '18px', fontWeight: '900' }}>{item}：</label>
                            <Form.Item style={{ marginTop: '20px' }}>
                              <Editor
                                inline={false}
                                selector='editorStateRef'
                                apiKey={EDITORAPIKEY}
                                value={renderListFieldData[RENDERLISTFIELD[index]]}
                                disabled={isReview}
                                onEditorChange={(content, editor) => handleEditorChange(content, editor, RENDERLISTFIELD[index])}
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
                  <div id="print3">
                    <div style={{ marginTop: '30px', float: 'right' }}>
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
                  </div>
                </Spin>
              </Form> : <div style={{ color: '#ccc' }}>请选择左边列表查看详情</div>
          }
        </div>
      </div>
      {
        addEditModalVisible ?
          <AddEditModal
            title="出诊记录单"
            addEditData={addEditData}
            visible={addEditModalVisible}
            confirmLoading={addEditModalLoading}
            onCancel={handleAddEditCancel}
            onOk={handleAddEditOk}
          /> : null
      }
    </div>
  )
}

export default connect((state) => state.user, null)(VisitRecord);
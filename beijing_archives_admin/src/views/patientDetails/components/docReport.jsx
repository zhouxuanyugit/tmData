import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  message,
  Upload,
  Tooltip,
  Collapse,
  Image,
  Modal
} from 'antd';
import { connect } from "react-redux";
import { CaretRightOutlined, PrinterOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { decryption } from "@/utils/secret";
import { getLocalStorage } from "@/utils/auth";
import { getDocReportList, addDocReport, deleteDocReport } from "@/api/patientDetails";
import { categoryByCreateTime } from "@/utils";
import { UPLOADFILEURL, HOSTPRO } from "@/utils/constants";

const { Panel } = Collapse;

const listQuery = { start_time: moment().subtract(12, 'months').unix(), end_time: moment().endOf('day').unix() }

/** 文档报告 */
const DocReport = ({ token, id }) => {
  const [fileList, setFileList] = useState([]);
  const [defaultActiveKey, setDefaultActiveKey] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [domain, setDomain] = useState('');
  const [url, setUrl] = useState(''); //点击后url的值
  const [type, setType] = useState(''); //点击后文件类型

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getDocReportList({
      ...listQuery,
      patient_id: parseInt(id)
    });
    const fileListOrigin = result.data.list;
    const fileListFormat = categoryByCreateTime(fileListOrigin);
    setDomain(result.data.file_domain);
    setFileList(fileListFormat);
    setDefaultActiveKey(Array.from(Array(fileListFormat.length), (v, k) => `${k + 1}`));
  }

  const beforeUpload = (file) => {
    let typeStr = file.name.split('.')[1];
    typeStr = typeStr.toLowerCase();
    const fileType =
      typeStr === 'jpg'
      || typeStr === 'png'
      || typeStr === 'pdf'
      || typeStr === 'xls'
      || typeStr === 'xlsx'
      || typeStr === 'doc'
      || typeStr === 'docx'
      || typeStr === 'mp4'
      || typeStr === 'mov'
      || typeStr === 'txt'
    if (!fileType) {
      message.error('目前只支持jpg、png、pdf、xls、xlsx、doc、docx、mp4、mov、txt文件上传');
      return false;
    }
    if (file.size / 1024 / 1024 > 50) {
      message.error('文件大小不能超过50M');
      return false;
    }
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  };

  const handleUploadFile = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const { url } = HOSTPRO ? decryption(info.file.response.data) : info.file.response.data;
      const name = info.file.name;

      addDocReport({
        patient_id: parseInt(id),
        file_name: name,
        file_short_url: url
      }).then(() => {
        message.success('添加成功！');
        fetchData();
      })
    }
  }

  const handleChangePanel = (key) => {
    setDefaultActiveKey(key);
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
    if (type === 'png' || type === 'jpg') {
      doc.write(`<div><img id="img" src=${url} style="max-width: 100%" /></div>`); //<style media="print">@page{margin: 0 auto}</style>
    }
    doc.getElementById('img').onload = function() {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
    doc.close();
  }

  const displayDoc = (item) => {
    const typeStr = item.file_name.split('.')[1].toLowerCase()
    const URLStr = `${domain}${window.atob(item.file_short_url)}`
    setSelectedDoc(item);
    setType(typeStr);
    if (typeStr === 'png' || typeStr === 'jpg' || typeStr === 'pdf') {
      setUrl(URLStr);
    }
  }

  const handleDeleteDoc = () => {
    Modal.confirm({
      title: <div>你确认要对 <span style={{ color: 'red' }}>{selectedDoc.file_name}</span> 进行删除？</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const { id } = selectedDoc;
        deleteDocReport({ id }).then(() => {
          message.success(`删除成功`);
          setSelectedDoc(null);
          setType('');
          fetchData();
        })
      }
    });
  }

  return (
    <div className="health-doc-container doc-report-container">
      <div className="catelog doc">
        <div className="catelog-header">
          <Upload
            name="myfile"
            showUploadList={false}
            headers={{ token, authcode: getLocalStorage('authCode') }}
            action={UPLOADFILEURL}
            beforeUpload={beforeUpload}
            onChange={handleUploadFile}
          >
            <Button type="primary" className="btn">
              上传文档
            </Button>
          </Upload>

          <Tooltip title="目前只支持jpg、png、pdf、xls、xlsx、doc、docx、mp4、mov、txt文件上传">
            <span className="health-doc-tips">支持上传文档</span>
          </Tooltip>
        </div>
        <div className="list-container">
          <Collapse
            activeKey={defaultActiveKey}
            ghost
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            onChange={handleChangePanel}
          >
            {
              fileList.map((item, index) => {
                return (
                  <Panel header={<span className="panel-item-header">{item.date}</span>} key={index + 1}>
                    {
                      item.urls.map((item, uIndex) =>
                        <div key={uIndex}>
                          <Button
                            type="link"
                            className={selectedDoc?.id === item.id ? 'doc-link-btn active' : 'doc-link-btn'}
                            onClick={() => displayDoc(item)}
                          >
                            {item.file_name}
                          </Button>
                        </div>
                      )
                    }
                  </Panel>
                )
              })
            }
          </Collapse>
        </div>
      </div>
      <div className="content">
        <div>
          <Form className="content-form">
            <div className="btns">
              {
                type === 'png' || type === 'jpg' ?
                  <>
                    <Button type="link" className="" onClick={print}>
                      <Tooltip placement="bottom" title="打印">
                        <PrinterOutlined />
                      </Tooltip>
                    </Button>
                  </> : null
              }
              {
                selectedDoc ?
                  <Button type="link" className="" onClick={handleDeleteDoc}>
                    <Tooltip placement="bottom" title="删除">
                      <DeleteOutlined />
                    </Tooltip>
                  </Button> : null
              }
              {
                type === 'png' || type === 'jpg' ?
                  <span className="tips">点击图片可以旋转、放大查看</span> : null
              }
            </div>
            {/* 以下为需要打印内容，所以用内联样式，麻烦哦 */}
            <div id="print" className="print-content">
              {
                type === 'png' || type === 'jpg' ?
                  <div className="doc-image-container">
                    <Image src={url} />
                  </div> : null
              }
              {
                type === 'pdf' ?
                  <>
                    <iframe
                      src={url}
                      width="100%"
                      height="98%"
                      frameborder="0"
                    ></iframe>
                  </> : null
              }
              {
                type !== 'png'
                  && type !== 'jpg'
                  && type !== 'pdf' ?
                  <div className="print-text">文档仅支持jpg、png、pdf查看</div> : null
              }
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}


export default connect((state) => state.user, null)(DocReport);
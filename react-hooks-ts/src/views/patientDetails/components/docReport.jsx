import React, { useState, useEffect } from 'react';
import {
  Timeline,
  Button,
  Form,
  message,
  Upload
} from 'antd';
import { connect } from "react-redux";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import moment from 'moment';
import { getDocReportList, addDocReport } from "@/api/patientDetails";
import { categoryByCreateTime } from "@/utils";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

/** 文档报告 */
const DocReport = ({ token, id }) => {
  const [listQuery, setListQuery] = useState({ start_time: moment().subtract(6, 'months').unix(), end_time: moment().endOf('day').unix() });
  const [fileList, setFileList] = useState([]);
  const [domain, setDomain] = useState('');
  const [url, setUrl] = useState(''); //点击后url的值
  const [type, setType] = useState(''); //点击后文件类型
  const [numPages, setNumPages] = useState(0); //pdf的页码总数

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getDocReportList({
      ...listQuery,
      patient_id: parseInt(id)
    });
    const fileList = result.data.list;
    setDomain(result.data.file_domain);
    setFileList(categoryByCreateTime(fileList));
  }

  const beforeUpload = (file) => {
    if (!file.size) {
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
      const result = info.file.response.data;
      const name = info.file.name;
      const { url } = result;

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

  const onLoadSuccess = ({ numPages }) => {
    console.log(numPages);
    setNumPages(numPages);
  }

  const displayDoc = (item) => {
    setType(item.file_name.split('.')[1]);
    setUrl(`${domain}${window.atob(item.file_short_url)}`);
  }

  return (
    <div className="health-doc-container">
      <div className="catelog">
        <div>
          <Upload
            name="myfile"
            showUploadList={false}
            headers={{ token }}
            action="/api/Upload/UpFile"  // TODO: 本地开发用/api，正式环境需要删除
            beforeUpload={beforeUpload}
            onChange={handleUploadFile}
          >
            <Button type="primary" className="btn">
              上传文档
            </Button>
          </Upload>
        </div>
        <div className="list-container">
          <Timeline>
            {
              fileList.map((item, index) => {
                return (
                  <Timeline.Item key={index}>
                    <div className="report-title">{item.date}</div>
                    {
                      item.urls.map((item, uIndex) => <div key={uIndex}><a onClick={() => displayDoc(item)}>{item.file_name}</a></div>)
                    }
                  </Timeline.Item>
                )
              })
            }
          </Timeline>
        </div>
      </div>
      <div className="content">
        <div>
          <Form className="content-form">
            <div className="btns">
              <Button type="primary" className="btn" onClick={print}>
                打印
              </Button>
            </div>
            {/* 以下为需要打印内容，所以用内联样式，麻烦哦 */}
            <div id="print" className="print-content">
              {
                type === 'png' || type === 'jpg' ?
                  <div><img src={url} alt="" style={{ width: '100%' }} /></div> : null
              }
              {
                type === 'pdf' ?
                  <div>
                    <Document
                      file={url}
                      loading={<div>加载中，请等待!</div>}
                      onLoadSuccess={onLoadSuccess}
                    >
                      {
                        new Array(numPages + 1).fill('').map((item, index) => {
                          return <div key={index}><Page noData={null} width={900} key={index} pageNumber={index} /><br /></div>;
                        })
                      }
                    </Document>
                  </div> : null
              }
              {
                type === '' ?
                  <div>文档仅支持jpg、png、pdf查看</div> : null
              }
            </div>
          </Form>
        </div>
      </div>
    </div >
  )
}


export default connect((state) => state.user, null)(DocReport);
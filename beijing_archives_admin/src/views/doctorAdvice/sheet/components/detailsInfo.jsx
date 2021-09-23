import React, { useState, useEffect, useContext } from 'react';
import {
  Form,
  Button,
  DatePicker,
  Select,
  Typography,
  message,
  Spin,
  Input
} from "antd";
import { Context } from "../index";
import { getUserList } from "@/api/system";
import { getDoctorAdviceList } from "@/api/doctorAdvice";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Title } = Typography;

const DatailsInfo = () => {
  const [listQuery, setListQuery] = useState({
    index: 1,
    page_size: 9999,
    time_type: 1,
    sign_doctor: '',
    start_time: '',
    end_time: ''
  });
  const [doctorList, setDoctorList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeType, setTimeType] = useState(1);
  const { chareData, dispatch } = useContext(Context);

  useEffect(() => {
    getDoctorData();
  }, [])

  useEffect(() => {
    setTableList([]);
  }, [chareData])

  const getDoctorData = async () => {
    const result = await getUserList({ index: 1, page_size: 9999, status: 2, role_id: '' });
    const doctorList = result.data.list;
    setDoctorList(doctorList);
  }

  const filterDateRangeChange = (dates, dateStrings) => {
    setListQuery({
      ...listQuery,
      start_time: dates ? moment(dates[0]).startOf('day').unix() : '',
      end_time: dates ? moment(dates[1]).endOf('day').unix() : ''
    })
  }

  const filterTypeChange = (value) => {
    setListQuery({
      ...listQuery,
      time_type: value,
    });
  }

  const filterDoctorChange = (value) => {
    setListQuery({
      ...listQuery,
      sign_doctor: value,
    });
  }

  const searchData = async () => {
    if (!chareData.id) {
      message.warn("请选择委托人！")
      return
    }
    setLoading(true);
    const result = await getDoctorAdviceList({ ...listQuery, time_type: parseInt(listQuery.time_type), patient_id: chareData.id });
    setTableList(result.data.list);
    setTimeType(parseInt(listQuery.time_type));
    setLoading(false);
  }

  const handleResetData = () => {
    setListQuery({
      index: 1,
      page_size: 9999,
      time_type: 1,
      sign_doctor: '',
      start_time: '',
      end_time: ''
    })
  }

  const printTable = () => {
    let iframe = document.getElementById("print-iframe");
    if (iframe) {
      document.body.removeChild(iframe);
    }
    iframe = document.createElement('IFRAME');
    iframe.setAttribute("id", "print-iframe");
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    let doc = iframe.contentWindow.document;
    doc.write(`<div>${document.getElementById('print').innerHTML}</div>`);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }

  return (
    <div className="details-info-container">
      <div className="details-search">
        <h1 className="details-title">设置医嘱单</h1>
        <Form layout="vertical">
          <Form.Item label="医嘱类型:">
            <Select
              value={listQuery.time_type}
              onChange={filterTypeChange}>
              <Select.Option value={1}>临时医嘱</Select.Option>
              <Select.Option value={2}>长期医嘱</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="下嘱医生:">
            <Select
              value={listQuery.sign_doctor}
              onChange={filterDoctorChange}>
              <Select.Option value="">全部</Select.Option>
              {
                doctorList.map(item => (
                  <Select.Option value={item.user_name} key={item.id}>{item.user_name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item label="发起时间:">
            <RangePicker
              value={[listQuery.start_time && moment(listQuery.start_time * 1000), listQuery.end_time && moment(listQuery.end_time * 1000)]}
              onChange={filterDateRangeChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={searchData}>
              刷新医嘱
            </Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleResetData}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="details-table">
        <div>
          <Button type="primary" onClick={printTable} disabled={!chareData.id}>
            打印
          </Button>
        </div>
        {/* 需要打印，样式最好内嵌 */}
        {
          chareData.id ?
            <Spin spinning={loading} wrapperClassName="print-content">
              <div id="print">
                <Title level={2} style={{ textAlign: 'center' }}>{timeType === 1 ? '临时医嘱' : '长期医嘱'}</Title>
                <div style={{ display: 'flex', minWidth: '800px', justifyContent: 'space-between' }}>
                  <div style={{ width: '150px' }}><span>代号：</span><span>{chareData.code}</span></div>
                  <div style={{ width: '100px' }}><span>性别：</span><span>{chareData.sex === 1 ? '男' : chareData.sex === 2 ? '女' : '保密'}</span></div>
                  <div style={{ width: '200px' }}>
                    <Input style={{ width: '90%', border: 'none', padding: '0' }} maxLength="30" placeholder="301医院：" />
                  </div>
                  <div style={{ width: '200px' }}>
                    <Input style={{ width: '90%', border: 'none', padding: '0' }} maxLength="30" placeholder="协和医院：" />
                  </div>
                  <div style={{ width: '200px' }}>
                    <Input style={{ width: '90%', border: 'none', padding: '0' }} maxLength="30" placeholder="北京医院：" />
                  </div>
                </div>
                <div style={{ marginTop: '30px', minWidth: '800px' }}>
                  <table border="1" cellSpacing="0" width="100%" bordercolor="#ccc">
                    <thead>
                      <tr>
                        <th width="100px" style={{ padding: '5px' }}>开始时间</th>
                        <th width="400px" style={{ padding: '5px' }}>医嘱</th>
                        <th width="80px" style={{ padding: '5px' }}>医师签名</th>
                        <th width="80px" style={{ padding: '5px' }}>护士签名</th>
                        <th width="100px" style={{ padding: '5px' }}>终止时间</th>
                        <th width="80px" style={{ padding: '5px' }}>医师签名</th>
                        <th width="80px" style={{ padding: '5px' }}>护士签名</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tableList.map(ele => {
                          return (
                            <tr key={ele.id}>
                              <td style={{ padding: '5px' }}>{moment(ele.treatment_start_time * 1000).format('YYYY.MM.DD')}</td>
                              <td style={{ padding: '5px' }}>{`${ele.say} ${ele.spec} ${ele.dose} ${ele.frequency}`}</td>
                              <td style={{ padding: '5px' }}>{ele.sign_doctor}</td>
                              <td style={{ padding: '5px' }}></td>
                              <td style={{ padding: '5px' }}>{moment(ele.treatment_end_time * 1000).format('YYYY.MM.DD')}</td>
                              <td style={{ padding: '5px' }}>{ele.sign_doctor}</td>
                              <td style={{ padding: '5px' }}></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </Spin> : null
        }

      </div>
    </div>
  )
}

export default DatailsInfo;
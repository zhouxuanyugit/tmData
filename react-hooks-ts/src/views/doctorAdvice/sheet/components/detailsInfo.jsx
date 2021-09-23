import React, { useState, useEffect, useContext } from 'react';
import {
  Form,
  Button,
  DatePicker,
  Select,
  Typography,
  message,
  Spin
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

  const getDoctorData = async () => {
    const result = await getUserList({ index: 1, page_size: 9999, status: 2, role_id: '' });
    const doctorList = result.data.list;
    setDoctorList(doctorList);
  }

  const filterDateRangeChange = (dates, dateStrings) => {
    setListQuery({
      ...listQuery,
      start_time: moment(dates[0]).unix(),
      end_time: moment(dates[1]).unix()
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
      message.warn("请选择患者！")
      return
    }
    setLoading(true);
    const result = await getDoctorAdviceList({ ...listQuery, time_type: parseInt(listQuery.time_type), patient_id: chareData.id });
    setTableList(result.data.list);
    setTimeType(parseInt(listQuery.time_type));
    setLoading(false);
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
              <Select.Option value={1}>长期医嘱</Select.Option>
              <Select.Option value={2}>临时医嘱</Select.Option>
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
              allowClear={false}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={searchData}>
              刷新医嘱
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
                <Title level={2} style={{ textAlign: 'center' }}>{timeType === 1 ? '长期医嘱' : '临时医嘱'}</Title>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '20%' }}><span>代号：</span><span>{chareData.code}</span></div>
                  <div style={{ width: '20%' }}><span>性别：</span><span>{chareData.sex === 1 ? '男' : '女'}</span></div>
                  <div style={{ width: '20%' }}><span>301医院：</span></div>
                  <div style={{ width: '20%' }}><span>协和医院：</span></div>
                  <div style={{ width: '20%' }}><span>北京医院：</span></div>
                </div>
                <div style={{ marginTop: '30px' }}>
                  <table border="1" cellSpacing="0" width="100%" bordercolor="#ccc">
                    <thead>
                      <tr>
                        <th width="100px">开始时间</th>
                        <th>医嘱</th>
                        <th width="60px">医师</th>
                        <th width="60px">护士</th>
                        <th width="100px">终止时间</th>
                        <th width="60px">医师</th>
                        <th width="60px">护士</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tableList.map(ele => {
                          return (
                            <tr key={ele.id}>
                              <td>{moment(ele.treatment_start_time * 1000).format('YYYY.MM.DD')}</td>
                              <td>{`${ele.say} ${ele.spec} ${ele.dose} ${ele.frequency}`}</td>
                              <td>{ele.sign_doctor}</td>
                              <td></td>
                              <td>{moment(ele.treatment_end_time * 1000).format('YYYY.MM.DD')}</td>
                              <td>{ele.sign_doctor}</td>
                              <td></td>
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
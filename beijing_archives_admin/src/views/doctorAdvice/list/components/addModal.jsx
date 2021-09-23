import React, { useState } from 'react';
import {
  Table,
  Button,
  DatePicker,
  Select,
  Input,
  message,
  Popover
} from 'antd';
import { connect } from "react-redux";
import moment from 'moment';
import { getLocalStorage, setLocalStorage } from "@/utils/auth";
import { addDoctorAdvice } from "@/api/doctorAdvice";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AddModal = ({ name, id, patientList, fetchData, timeType, hNum }) => {
  const [dataList, setDataList] = useState(getLocalStorage('doctorAdviceAddList') ? JSON.parse(getLocalStorage('doctorAdviceAddList')) : []); // 数据列表
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 已经选择的数据列表的index
  const [isComfirmed, setIsComfirmed] = useState(false); // 是否再审核中的flag
  const [visible, setVisible] = useState(false); // 
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: text => (<span>{text + 1}</span>)
    },
    {
      title: <span><span className="required-star">*</span>治疗时间</span>,
      dataIndex: 'treatment_time',
      width: 250,
      render: (text, record, index) => (
        <div>
          <RangePicker
            placeholder={['开始时间', '结束时间']}
            onChange={(date, dateString) => onChangeDate(date, dateString, index)}
            allowClear={false}
            locale={locale}
            value={[text[0] ? moment(text[0] * 1000) : '', text[1] ? moment(text[1] * 1000) : '']}  //防止输入框缓存
            disabled={isComfirmed}
          />
        </div>
      ),
    },
    {
      title: '医嘱分类',
      dataIndex: 'say_type',
      width: 150,
      render: (text, record, index) => (
        <div>
          {
            text === 1 ? '用药医嘱' : text === 2 ? '非药品治疗医嘱' : '保健医嘱'
          }
        </div>
      ),
    },
    {
      title: <span><span className="required-star">*</span>医嘱</span>,
      dataIndex: 'say',
      width: 400,
      render: (text, record, index) => (
        <div className="add-modal-input-textarea">
          <Input
            maxLength={100}
            placeholder="请输入医嘱（最长100个汉字）"
            onChange={(e) => onchangeAdvice(e, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
            onFocus={(e) => handleFocusInput(e)}
          />
          <TextArea
            style={{ display: 'none' }}
            rows={4}
            value={text}
            maxLength={100}
            placeholder="请输入医嘱（最长100个汉字）"
            onChange={(e) => onchangeAdvice(e, index)}
            onBlur={(e) => handleBlurInput(e)}
          />
        </div>
      ),
    },
    {
      title: '规格',
      dataIndex: 'spec',
      width: 100,
      render: (text, record, index) => (
        <div>
          {
            typeof text !== 'undefined' ?
              <Input
                maxLength={20}
                onChange={(e) => onchangeSpec(e, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
              /> : null
          }
        </div>
      ),
    },
    {
      title: '剂量',
      dataIndex: 'dose',
      width: 100,
      render: (text, record, index) => (
        <div>
          {
            typeof text !== 'undefined' ?
              <Input
                maxLength={20}
                onChange={(e) => onchangeDose(e, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
              /> : null
          }
        </div>
      ),
    },
    {
      title: '途径',
      dataIndex: 'channel',
      width: 100,
      render: (text, record, index) => (
        <div>
          {
            typeof text !== 'undefined' ?
              <Input
                maxLength={20}
                onChange={(e) => onchangeChannel(e, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
              /> : null
          }
        </div>
      ),
    },
    {
      title: '频次',
      dataIndex: 'frequency',
      width: 120,
      render: (text, record, index) => (
        <div>
          <Select
            allowClear={false}
            style={{ width: '100%' }}
            onChange={(value) => handleChangeRate(value, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
          >
            <Option value="每日1次">每日1次</Option>
            <Option value="每日2次">每日2次</Option>
            <Option value="每日3次">每日3次</Option>
          </Select>
        </div>
      ),
    },
    {
      title: '附加说明',
      dataIndex: 'explain',
      width: 400,
      render: (text, record, index) => (
        <div className="add-modal-input-textarea">
          {
            typeof text !== 'undefined' ?
              <Input
                maxLength={100}
                placeholder="请输入附加说明（最长100个汉字）"
                onChange={(e) => onchangeNotes(e, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
                onFocus={(e) => handleFocusInput(e)}
              /> : null
          }
          {
            typeof text !== 'undefined' ?
              <TextArea
                style={{ display: 'none' }}
                rows={4}
                value={text}
                maxLength={100}
                placeholder="请输入附加说明（最长100个汉字）"
                onChange={(e) => onchangeNotes(e, index)}
                onBlur={(e) => handleBlurInput(e)}
              /> : null
          }
        </div>
      ),
    },
    {
      title: '下嘱医生',
      dataIndex: 'sign_doctor',
      width: 100
    },
    {
      title: '是否摆药',
      dataIndex: 'is_get_drug',
      width: 100,
      render: (text, record, index) => (
        <div>
          {
            typeof text !== 'undefined' ?
              <Select
                allowClear={false}
                style={{ width: '100%' }}
                onChange={(value) => handleChangeIsDrug(value, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
              >
                <Option value={1}>是</Option>
                <Option value={2}>否</Option>
              </Select> : null
          }
        </div>
      ),
    },
    {
      title: '是否自备',
      dataIndex: 'is_own',
      width: 100,
      render: (text, record, index) => (
        <div>
          {
            typeof text !== 'undefined' ?
              <Select
                allowClear={false}
                style={{ width: '100%' }}
                onChange={(value) => handleChangeIsSelf(value, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
              >
                <Option value={1}>是</Option>
                <Option value={2}>否</Option>
              </Select> : null
          }
        </div>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 400,
      render: (text, record, index) => (
        <div className="add-modal-input-textarea">
          {
            typeof text !== 'undefined' ?
              <Input
                maxLength={100}
                placeholder="请输入备注（最长100个汉字）"
                onChange={(e) => onchangeRemarks(e, index)}
                value={text}  //防止输入框缓存
                disabled={isComfirmed}
                onFocus={(e) => handleFocusInput(e)}
              /> : null
          }
          {
            typeof text !== 'undefined' ?
              <TextArea
                style={{ display: 'none' }}
                rows={4}
                value={text}
                maxLength={100}
                placeholder="请输入备注（最长100个汉字）"
                onChange={(e) => onchangeRemarks(e, index)}
                onBlur={(e) => handleBlurInput(e)}
              /> : null
          }
        </div>
      ),
    },
  ];

  const handleFocusInput = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
    e.target.nextSibling.focus();
  }

  const handleBlurInput = (e) => {
    e.target.style.display = 'none';
    e.target.previousSibling.style.display = 'block';
  }

  const onChangeDate = (date, dateString, index) => {
    dataList[index].treatment_start_time = moment(date[0]).unix();
    dataList[index].treatment_end_time = moment(date[1]).unix();
    dataList[index].treatment_time = [moment(date[0]).unix(), moment(date[1]).unix()];
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onchangeAdvice = (e, index) => {
    dataList[index].say = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onchangeSpec = (e, index) => {
    dataList[index].spec = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onchangeDose = (e, index) => {
    dataList[index].dose = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onchangeChannel = (e, index) => {
    dataList[index].channel = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const handleChangeRate = (value, index) => {
    dataList[index].frequency = value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onchangeNotes = (e, index) => {
    dataList[index].explain = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const handleChangeIsDrug = (value, index) => {
    dataList[index].is_get_drug = value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const handleChangeIsSelf = (value, index) => {
    dataList[index].is_own = value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onchangeRemarks = (e, index) => {
    dataList[index].remarks = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList]));
  }
  const onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  }
  const handleVisibleChange = (visible) => {
    !isComfirmed && setVisible(visible);
  }
  const handleAddData = (type) => {
    let addItem = {};
    if (type === 1) {
      addItem = {
        index: dataList.length,
        treatment_time: [],
        treatment_start_time: '',
        say_type: type,
        say: '',
        spec: '',
        dose: '',
        channel: '',
        frequency: '每日1次',
        treatment_end_time: '',
        sign_doctor: name,
        is_get_drug: 1,
        is_own: 1,
        remarks: ''
      }
    } else if (type === 2) {
      addItem = {
        index: dataList.length,
        treatment_time: [],
        treatment_start_time: '',
        say_type: type,
        say: '',
        frequency: '每日1次',
        explain: '',
        treatment_end_time: '',
        sign_doctor: name,
      }
    } else if (type === 3) {
      addItem = {
        index: dataList.length,
        treatment_time: [],
        treatment_start_time: '',
        say_type: type,
        say: '',
        frequency: '每日1次',
        explain: '',
        treatment_end_time: '',
        sign_doctor: name
      }
    }
    setDataList([...dataList, addItem]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...dataList, addItem]));
    setVisible(false);
  }
  const handleDeleteData = () => {
    if (!selectedRowKeys.length) {
      message.warning(`请选择需要删除的选项`);
      return
    }
    let newDataList = [],
      newIndex = 0;
    for (let i = 0, len = dataList.length; i < len; i++) {
      if (!selectedRowKeys.includes(dataList[i].index)) {
        const copyData = { ...dataList[i] };
        copyData.index = newIndex;
        newDataList.push(copyData);
        newIndex++;
      }
    }
    setDataList([...newDataList]);
    setLocalStorage('doctorAdviceAddList', JSON.stringify([...newDataList]));
    setSelectedRowKeys([]);
  }
  const handleConfirmData = () => {
    if (dataList.find(item => !item.treatment_start_time)) {
      message.error('治疗开始或者结束时间不能为空。');
      return;
    }
    if (dataList.find(item => !item.treatment_end_time)) {
      message.error('治疗开始或者结束时间不能为空。');
      return;
    }
    if (dataList.find(item => !item.say)) {
      message.error('医嘱不能为空。');
      return;
    }
    setIsComfirmed(true);
  }
  const handleCancelData = () => {
    setIsComfirmed(false);
  }
  const handleConfirmAddData = async () => {
    const dataListCopy = JSON.parse(JSON.stringify(dataList));

    const patientInfo = patientList.find(ele => {
      return ele.id === id;
    })

    dataListCopy.forEach(ele => {
      delete ele.index;
      delete ele.treatment_time;
      ele.patient_id = patientInfo.id;
      ele.code = patientInfo.code;
      ele.time_type = parseInt(timeType);
    });
    setLoading(true);
    const result = await addDoctorAdvice({ bodys: JSON.stringify(dataListCopy) });
    if (result) {
      setDataList([]);
      setLocalStorage('doctorAdviceAddList', '');
      fetchData();
      setIsComfirmed(false);
      setLoading(false);
    }
  }

  return (
    <div className="add-modal-container">
      <div className="add-modal-table" style={{ height: (hNum - 60), overflow: 'auto' }}>
        <Table
          bordered
          rowKey={(record) => record.index}
          rowSelection={{ selectedRowKeys, onChange: onChangeRowSelection }}
          columns={columns}
          dataSource={dataList}
          pagination={false}
          size="small"
          scroll={{ x: 2500 }} // y: hNum - 100 table内部的滚动
        />
      </div>

      <div className="add-modal-btns">
        <Popover
          content={
            <>
              <div>
                <a onClick={() => handleAddData(1)}>用药医嘱</a>
              </div>
              <div>
                <a onClick={() => handleAddData(2)}>非药物治疗医嘱</a>
              </div>
              <div>
                <a onClick={() => handleAddData(3)}>保健医嘱</a>
              </div>
            </>
          }
          title="请选中医嘱类型"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button type="primary" className="btn" disabled={isComfirmed}>
            添加
          </Button>
        </Popover>
        <Button type="primary" className="btn" onClick={handleDeleteData} disabled={isComfirmed}>
          删除
        </Button>
        <Button type="primary" className="btn" onClick={handleConfirmData} disabled={!dataList.length}>
          审核医嘱
        </Button>
        <Button type="primary" className="btn" onClick={handleCancelData} disabled={!isComfirmed}>
          取消审核
        </Button>
        <Button type="primary" className="btn" onClick={handleConfirmAddData} disabled={!isComfirmed} loading={loading}>
          确认添加
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    ...state.user,
  };
};
export default connect(mapStateToProps, null)(AddModal);
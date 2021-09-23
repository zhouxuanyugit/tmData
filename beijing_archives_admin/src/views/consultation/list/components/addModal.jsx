import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  DatePicker,
  Select,
  Input,
  message,
  AutoComplete
} from 'antd';
import moment from 'moment';
import { getExpertList, addConsultation } from "@/api/consultation";
import { getLocalStorage, setLocalStorage } from "@/utils/auth";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { TextArea } = Input;

const AddModal = ({ id, fetchData, hNum }) => {
  const [expertList, setExpertList] = useState([]); // 专家的选项
  const [dataList, setDataList] = useState(getLocalStorage('consultationAddList') ? JSON.parse(getLocalStorage('consultationAddList')) : []); // 数据列表
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 已经选择的数据列表的index
  const [isComfirmed, setIsComfirmed] = useState(false); // 已经选择的数据列表的index
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExpertData();
  }, []);

  const getExpertData = async () => {
    const result = await getExpertList({ index: 1, page_size: 9999, name: '' });
    const expertList = result.data.list;
    setExpertList(expertList);
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (text, record, index) => (
        <span>{text + 1}</span>
      ),
    },
    {
      title: '会诊时间',
      dataIndex: 'union_time',
      width: 160,
      render: (text, record, index) => (
        <div>
          <DatePicker
            onChange={(date, dateString) => onChangeDate(date, dateString, index)}
            allowClear={false}
            locale={locale}
            value={moment(text * 1000)}  //防止输入框缓存
            disabled={isComfirmed}
          />
        </div>
      ),
    },
    {
      title: <span><span className="required-star">*</span>会诊专家</span>,
      dataIndex: 'experts',
      width: 300,
      render: (text, record, index) => (
        <div>
          <Select
            mode="multiple"
            allowClear={false}
            style={{ width: '100%' }}
            placeholder="请选择会诊专家"
            onChange={(value) => handleChangeExpert(value, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {expertList.map(item => (<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>))}
          </Select>
        </div>
      ),
    },
    {
      title: <span><span className="required-star">*</span>机构名称</span>,
      dataIndex: 'organization',
      width: 300,
      render: (text, record, index) => (
        <div>
          <AutoComplete
            style={{ width: '100%' }}
            options={record.orgSelectedList}
            placeholder="请输入机构名称"
            disabled={isComfirmed}
            value={text}
            onChange={(value) => onchangeOrgName(value, index)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </div>
      ),
    },
    {
      title: <span><span className="required-star">*</span>下嘱医生</span>,
      dataIndex: 'expert_id',
      width: 180,
      render: (text, record, index) => (
        <div>
          <Select
            allowClear={false}
            style={{ width: '100%' }}
            placeholder="请选择下嘱医生"
            onChange={(value) => handleChangeDoctor(value, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
          >
            {record.expertsSelectedList.map(item => (<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>))}
          </Select>
        </div>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 400,
      render: (text, record, index) => (
        <div className="add-modal-input-textarea">
          <Input
            maxLength={100}
            placeholder="请输入备注（最长100个汉字）"
            onChange={(e) => onchangeRemarks(e, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
            onFocus={(e) => handleFocusInput(e)}
          />
          <TextArea
            style={{ display: 'none' }}
            rows={4}
            value={text}
            maxLength={100}
            placeholder="请输入备注（最长100个汉字）"
            onChange={(e) => onchangeRemarks(e, index)}
            onBlur={(e) => handleBlurInput(e)}
          />
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
    dataList[index].union_time = moment(date).unix();
    setDataList([...dataList]);
    setLocalStorage('consultationAddList', JSON.stringify([...dataList]));
  }
  const handleChangeExpert = (value, index) => {
    const expertSelected = [];  // 下嘱医生列表
    const orgSelected = [];  // 机构名称列表
    const expertName = [];
    expertList.forEach(item => {
      if (value.includes(item.id)) {
        expertSelected.push(item);
        expertName.push(item.name);

        if (item.organization) {
          orgSelected.push({ value: item.organization });
        }
      }
    })
    dataList[index].experts = value;
    dataList[index].expert_ids = value.join(',');
    dataList[index].expert_content = expertName.join('、');
    dataList[index].expertsSelectedList = expertSelected;
    dataList[index].orgSelectedList = orgSelected;
    setDataList([...dataList]);
    setLocalStorage('consultationAddList', JSON.stringify([...dataList]));
  }
  const onchangeOrgName = (value, index) => {
    dataList[index].organization = value;
    setDataList([...dataList]);
    setLocalStorage('consultationAddList', JSON.stringify([...dataList]));
  }
  const handleChangeDoctor = (value, index) => {
    let expertName = '';
    expertList.forEach(item => {
      if (value === item.id) {
        expertName = item.name;
      }
    })
    dataList[index].sign_expert = expertName;
    dataList[index].expert_id = value;
    setDataList([...dataList]);
    setLocalStorage('consultationAddList', JSON.stringify([...dataList]));
  }
  const onchangeRemarks = (e, index) => {
    dataList[index].remarks = e.target.value;
    setDataList([...dataList]);
    setLocalStorage('consultationAddList', JSON.stringify([...dataList]));
  }
  const onChangeRowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
  }
  const handleAddData = () => {
    setDataList([
      ...dataList,
      {
        index: dataList.length, // 序号 不需要传
        union_time: moment().unix(), // 会诊时间
        experts: [], // 专家id[] 不需要传
        expert_ids: '', // 专家id字符串
        expert_content: '', // 专家name字符串
        orgSelectedList: [], // 机构名称选项 不需要传
        expertsSelectedList: [], // 下嘱医生选项 不需要传
        expert_id: undefined, // 下嘱医生id
        sign_expert: '', // 下嘱医生name
        organization: '', // 机构名称
        remarks: '' // 备注
      }
    ]);
    setLocalStorage('consultationAddList', JSON.stringify([
      ...dataList,
      {
        index: dataList.length, // 序号 不需要传
        union_time: moment().unix(), // 会诊时间
        experts: [], // 专家id[] 不需要传
        expert_ids: '', // 专家id字符串
        expert_content: '', // 专家name字符串
        orgSelectedList: [], // 机构名称选项 不需要传
        expertsSelectedList: [], // 下嘱医生选项 不需要传
        expert_id: undefined, // 下嘱医生id
        sign_expert: '', // 下嘱医生name
        organization: '', // 机构名称
        remarks: '' // 备注
      }
    ]));
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
    setLocalStorage('consultationAddList', JSON.stringify([...newDataList]));
    setSelectedRowKeys([]);
  }
  const handleConfirmData = () => {
    if (dataList.find(item => !item.expert_ids)) {
      message.error('会诊专家不能为空。');
      return;
    }
    if (dataList.find(item => !item.organization)) {
      message.error('机构名称不能为空。');
      return;
    }
    if (dataList.find(item => !item.expert_id)) {
      message.error('下嘱医生不能为空。');
      return;
    }
    setIsComfirmed(true);
  }
  const handleCancelData = () => {
    setIsComfirmed(false);
  }
  const handleConfirmAddData = async () => {
    const dataListCopy = JSON.parse(JSON.stringify(dataList));

    dataListCopy.forEach(ele => {
      delete ele.index;
      delete ele.experts;
      delete ele.expertsSelectedList;
      delete ele.orgSelectedList;
      ele.patient_id = id;
    });
    setLoading(true)
    const result = await addConsultation({ bodys: JSON.stringify(dataListCopy) });
    if (result) {
      setDataList([]);
      setLocalStorage('consultationAddList', '');
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
          scroll={{ x: 1200 }}
        />
      </div>

      <div className="add-modal-btns">
        <Button type="primary" className="btn" onClick={handleAddData} disabled={isComfirmed}>
          添加
        </Button>
        <Button type="primary" className="btn" onClick={handleDeleteData} disabled={isComfirmed}>
          删除
        </Button>
        <Button type="primary" className="btn" onClick={handleConfirmData} disabled={!dataList.length}>
          审核会诊
        </Button>
        <Button type="primary" className="btn" onClick={handleCancelData} disabled={!isComfirmed}>
          取消审核
        </Button>
        <Button type="primary" className="btn" onClick={handleConfirmAddData} disabled={!isComfirmed} loading={loading}>
          确认添加
        </Button>
      </div>
    </div >
  )
}

export default AddModal;
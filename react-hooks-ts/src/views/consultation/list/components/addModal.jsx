import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  DatePicker,
  Select,
  Input,
  message
} from 'antd';
import moment from 'moment';
import { getExpertList, addConsultation } from "@/api/consultation";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const AddModal = ({ fetchData }) => {
  const [expertList, setExpertList] = useState([]); // 专家的选项
  const [dataList, setDataList] = useState([]); // 数据列表
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 已经选择的数据列表的index
  const [isComfirmed, setIsComfirmed] = useState(false); // 已经选择的数据列表的index

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
      width: 200,
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
      title: '会诊专家',
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
          >
            {expertList.map(item => (<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>))}
          </Select>
        </div>
      ),
    },
    {
      title: '机构名称',
      dataIndex: 'organization',
      width: 300,
      render: (text, record, index) => (
        <div>
          <Input
            placeholder="请输入机构名称"
            onChange={(e) => onchangeOrgName(e, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
          />
        </div>
      ),
    },
    {
      title: '下嘱医生',
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
      render: (text, record, index) => (
        <div>
          <Input
            placeholder="请输入备注"
            onChange={(e) => onchangeRemarks(e, index)}
            value={text}  //防止输入框缓存
            disabled={isComfirmed}
          />
        </div>
      ),
    },
  ];
  const onChangeDate = (date, dateString, index) => {
    dataList[index].union_time = moment(date).unix();
    setDataList([...dataList]);
  }
  const handleChangeExpert = (value, index) => {
    const expertSelected = [];
    const expertName = [];
    expertList.forEach(item => {
      if (value.includes(item.id)) {
        expertSelected.push(item);
        expertName.push(item.name);
      }
    })
    dataList[index].experts = value;
    dataList[index].expert_ids = value.join(',');
    dataList[index].expert_content = expertName.join('、');
    dataList[index].expertsSelectedList = expertSelected;
    setDataList([...dataList]);
  }
  const onchangeOrgName = (e, index) => {
    dataList[index].organization = e.target.value;
    setDataList([...dataList]);
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
  }
  const onchangeRemarks = (e, index) => {
    dataList[index].remarks = e.target.value;
    setDataList([...dataList]);
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
        expertsSelectedList: [], // 下嘱医生选项 不需要传
        expert_id: undefined, // 下嘱医生id
        sign_expert: '', // 下嘱医生name
        organization: '', // 机构名称
        remarks: '' // 备注
      }
    ]);
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
    setSelectedRowKeys([]);
  }
  const handleConfirmData = () => {
    console.log(dataList);
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
    });

    const result = await addConsultation({ bodys: JSON.stringify(dataListCopy) });
    if (result) {
      setDataList([]);
      fetchData();
      setIsComfirmed(false);
    }
  }

  return (
    <div className="add-modal-container">
      <Table
        bordered
        rowKey={(record) => record.index}
        rowSelection={{ selectedRowKeys, onChange: onChangeRowSelection }}
        columns={columns}
        dataSource={dataList}
        pagination={false}
        size="small"
        scroll={{ y: 130 }}
      />

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
        <Button type="primary" className="btn" onClick={handleConfirmAddData} disabled={!isComfirmed}>
          确认添加
        </Button>
      </div>
    </div>
  )
}

export default AddModal;
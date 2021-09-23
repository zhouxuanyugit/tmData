import React, { useState, useEffect, useContext } from 'react';
import {
  Input,
  Table
} from "antd";
import { Context } from "../index";
import { getPatientList } from "@/api/patient";
const { Search } = Input;

const TableList = () => {
  const [selectedId, setSelectedId] = useState(0); // 选中的ID
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999, code: '' });
  const [tableList, setTableList] = useState([]);
  const { chareData, dispatch } = useContext(Context);

  useEffect(() => {
    fetchData();
  }, [listQuery]);

  /**获取患者列表 */
  const fetchData = async () => {
    const result = await getPatientList(listQuery);
    const tableList = result.data.list;
    setTableList(tableList);
    if (!tableList.length) {
      dispatch({ type: 'update_id', id: 0, code: '', sex: 0 });
      setSelectedId(0);
    }
  }

  /**搜索患者名称 */
  const onSearch = (value, event) => {
    const query = { ...listQuery };
    query.code = value
    setListQuery(query);
    dispatch({ type: 'update_id', id: 0, code: '', sex: 0 });
    setSelectedId(0);
  }

  /**点击每一行患者事件 */
  const handleOnClickRow = (event, record, index) => {
    setSelectedId(record.id);
    dispatch({ type: 'update_id', id: tableList[index].id, code: tableList[index].code, sex: tableList[index].sex });
  }

  /**渲染每一行active的 */
  const rowClassName = (record, index) => selectedId === record.id ? 'active' : ''

  const columns = [
    {
      title: '代号',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (text, record) => (
        <span>
          {text === 1 ? '男' : '女'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="search-bar">
        <Search
          placeholder="请输入搜索内容"
          enterButton="搜索"
          size="small"
          onSearch={onSearch}
        />
      </div>
      <div>
        <Table
          bordered
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={tableList}
          pagination={false}
          size="small"
          scroll={{ y: 600 }}
          onRow={(record, index) => {
            return {
              onClick: event => { handleOnClickRow(event, record, index) }, // 点击行
            };
          }}
          rowClassName={rowClassName}
        />
      </div>
    </div>
  )
}

export default TableList;
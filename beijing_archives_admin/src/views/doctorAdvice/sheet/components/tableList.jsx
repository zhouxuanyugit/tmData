import React, { useState, useEffect, useContext, useRef } from 'react';
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
  const [tableScrollY, setTableScrollY] = useState(0);
  const { chareData, dispatch } = useContext(Context);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [listQuery]);

  useEffect(() => {
    setTableScrollY(containerRef.current.clientHeight - 72);
  }, []);

  /**获取委托人列表 */
  const fetchData = async () => {
    const result = await getPatientList(listQuery);
    const tableList = result.data.list;
    setTableList(tableList);
    if (!tableList.length) {
      dispatch({ type: 'update_id', id: 0, code: '', sex: 0 });
      setSelectedId(0);
    }
  }

  /**搜索委托人名称 */
  const onSearch = (value, event) => {
    const query = { ...listQuery };
    query.code = value
    setListQuery(query);
    dispatch({ type: 'update_id', id: 0, code: '', sex: 0 });
    setSelectedId(0);
  }

  /**点击每一行委托人事件 */
  const handleOnClickRow = (event, record, index) => {
    setSelectedId(record.id);
    dispatch({ type: 'update_id', id: tableList[index].id, code: tableList[index].code, sex: tableList[index].sex });
  }

  /**渲染每一行active的 */
  const rowClassName = (record, index) => selectedId === record.id ? 'active' : ''

  const columns = [
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number'
    },
    {
      title: '代号',
      dataIndex: 'code',
      key: 'code'
    }
  ];

  return (
    <div style={{ height: '100%' }} ref={containerRef}>
      <div className="search-bar">
        <Search
          placeholder="请输入编号、代号搜索"
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
          scroll={{ y: tableScrollY }}
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
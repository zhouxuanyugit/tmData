import React, { useState, useEffect, useContext } from 'react';
import {
  Input,
  Table,
  Form,
  Button,
  Divider,
  Radio,
  message,
  Modal
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Context } from "../index";
import { getPatientList, addPatient, deletePatient } from "@/api/patient";
const { Search } = Input;

const TableList = () => {
  const [selectedId, setSelectedId] = useState(0); // 选中的ID
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999, code: '' });
  const [tableList, setTableList] = useState([]);
  const [form] = Form.useForm();
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
      dispatch({ type: 'update_id', id: 0, code: '' });
      setSelectedId(0);
    }
  }
  /**搜索患者名称 */
  const onSearch = (value, event) => {
    const query = { ...listQuery };
    query.code = value
    setListQuery(query);
    dispatch({ type: 'update_id', id: 0, code: '' });
    setSelectedId(0);
  }
  /**添加患者 */
  const onFinishAdd = async (values) => {
    if (!values.code) {
      message.error('代号不能为空！')
      return
    }

    const result = await addPatient(values);
    if (result) {
      message.success('添加成功')
      form.setFieldsValue({ code: '', sex: 1 });
      fetchData();
    }
  }
  /**点击每一行患者事件 */
  const handleOnClickRow = (event, record, index) => {
    setSelectedId(record.id);
    dispatch({ type: 'update_id', id: tableList[index].id, code: tableList[index].code });
  }
  const handleDelete = (e, record) => {
    e.stopPropagation();
    Modal.confirm({
      title: <div>你确认要对代号为 <span style={{ color: 'red' }}>{record.code}</span> 的患者进行删除！</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const { id } = record;
        deletePatient({ id }).then(() => {
          message.success(`删除成功`);
          if (id === selectedId) {
            dispatch({ type: 'update_id', id: 0, code: '' });
            setSelectedId(0);
          }
          fetchData();
        })
      }
    });
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
    {
      title: '',
      key: 'action',
      width: 30,
      render: (text, record) => (
        <div className="delete-icon" onClick={(e) => handleDelete(e, record)}>
          <DeleteOutlined />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* {chareData.user_id} */}
      <div className="search-bar">
        <Search
          placeholder="请输入搜索内容"
          allowClear
          enterButton="搜索"
          size="small"
          allowClear={false}
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
          scroll={{ y: 350 }}
          onRow={(record, index) => {
            return {
              onClick: event => { handleOnClickRow(event, record, index) }, // 点击行
            };
          }}
          rowClassName={rowClassName}
        />
      </div>
      <div className="add-form">
        <Divider plain>添加患者</Divider>
        <Form
          {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}
          layout="horizontal"
          form={form}
          size="small"
          initialValues={{
            code: '',
            sex: 1
          }}
          onFinish={onFinishAdd}
        >
          <Form.Item
            label="代号："
            name="code"
          >
            <Input placeholder="请输入代号" maxLength={6} />
          </Form.Item>
          <Form.Item
            label="性别："
            name="sex"
          >
            <Radio.Group>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...{ wrapperCol: { span: 20, offset: 4 } }}>
            <Button type="primary" htmlType="submit">确认添加</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default TableList;
import React, { useState, useEffect, useContext } from 'react';
import {
  Input,
  Table,
  Form,
  Button,
  Divider,
  message,
  Modal
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Context } from "../index";
import { getExpertList, addExpert, deleteExpert } from "@/api/consultation";
const { Search } = Input;

const TableList = () => {
  const [selectedId, setSelectedId] = useState(0); // 选中的ID
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999, name: '' });
  const [tableList, setTableList] = useState([]);
  const [form] = Form.useForm();
  const { chareData, dispatch } = useContext(Context);
  useEffect(() => {
    fetchData();
  }, [listQuery]);

  /**获取专家列表 */
  const fetchData = async () => {
    const result = await getExpertList(listQuery);
    const tableList = result.data.list;
    setTableList(tableList);
    if (!tableList.length) {
      dispatch({ type: 'update_id', id: 0, name: '' });
      setSelectedId(0);
    }
  }

  /**搜索专家名称 */
  const onSearch = (value, event) => {
    const query = { ...listQuery };
    query.name = value
    setListQuery(query);
    dispatch({ type: 'update_id', id: 0, name: '' });
    setSelectedId(0);
  }

  /**添加专家 */
  const onFinishAdd = async (values) => {
    if (!values.name || !values.major) {
      message.error('名称或者专业不能为空！')
      return
    }

    const result = await addExpert(values);
    if (result) {
      message.success('添加成功');
      form.setFieldsValue({ name: '', major: '' });
      fetchData();
    }
  }

  /**点击每一行专家事件 */
  const handleOnClickRow = (event, record, index) => {
    setSelectedId(record.id);
    dispatch({ type: 'update_id', id: tableList[index].id, name: tableList[index].name });
  }
  const handleDelete = (e, record) => {
    e.stopPropagation();
    Modal.confirm({
      title: <div>你确认要对名称为 <span style={{ color: 'red' }}>{record.name}</span> 的专家进行删除！</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const { id } = record;
        deleteExpert({ id }).then(() => {
          message.success(`删除成功`);
          if (id === selectedId) {
            dispatch({ type: 'update_id', id: 0, name: '' });
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
      title: '专家名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major'
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
      {/* {chareData.doctor_id} */}
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
        <Divider plain>添加专家</Divider>
        <Form
          {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}
          layout="horizontal"
          form={form}
          size="small"
          onFinish={onFinishAdd}
        >
          <Form.Item
            label="名称："
            name="name"
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            label="专业："
            name="major"
          >
            <Input placeholder="请输入专家专业" />
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
import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  Button,
  Pagination,
  Modal,
  Select,
  message
} from "antd";
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getAuthCodeList, updateAuthCodeStatus } from "@/api/system";
import "./index.less";
const { Column } = Table;

const AuthCode = () => {
  const [form] = Form.useForm();
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [listQuery, setListQuery] = useState({ status: '' });

  useEffect(() => {
    fetchData();
  }, [page, size, listQuery]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getAuthCodeList({ ...listQuery, index: page, page_size: size });
    if (result) {
      setTableList(result.data.list);
      setTotal(result.data.count);
      setLoading(false);
    }
  }

  const searchData = (values) => {
    setListQuery(state => ({ ...state, ...values }));
  }

  const resetData = () => {
    setPage(1);
    setListQuery({ status: '' });
  }

  const pageChange = (page, size) => {
    setPage(page);
  }

  const sizeChange = (page, size) => {
    setSize(size);
  }

  const handleStatus = (row, status) => {
    Modal.confirm({
      title: <div>你确认要对授权码为： <span style={{ color: 'red' }}>{row.auth_code}</span> 进行处理！</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { id } = row;
        updateAuthCodeStatus({ id, status }).then(() => {
          message.success(`修改成功`);
          fetchData();
        })
      }
    });
  }

  return (
    <div className="app-container">
      <Form
        layout="inline"
        form={form}
        initialValues={{ ...listQuery }}
        onFinish={searchData}
      >
        <Form.Item
          label="关键字"
          name="status"
        >
          <Select
            style={{ width: 120 }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={1}>授权中</Select.Option>
            <Select.Option value={2}>授权通过</Select.Option>
            <Select.Option value={3}>授权不通过</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={resetData} >
            重置
          </Button>
        </Form.Item>
      </Form>
      <br />
      <Table
        bordered
        rowKey={(record) => record.id}
        dataSource={tableList}
        loading={loading}
        pagination={false}
      >
        <Column title="授权码" dataIndex="auth_code" key="auth_code" align="center" />
        <Column title="申请人" dataIndex="user_name" key="user_name" align="center" />
        <Column title="状态" dataIndex="status" key="status" align="center"
          render={(status) => <span>{status === 1 ? '授权中' : status === 2 ? '授权通过' : '授权不通过'}</span>}
        />
        <Column title="创建时间" dataIndex="create_time" key="create_time" align="center"
          render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
        />
        <Column title="操作" key="action" align="center"
          render={(text, row) => (
            <span>
              {
                row.status === 1 ?
                  <>
                    <Button type="link" onClick={() => handleStatus(row, 3)}>
                      <span style={{ color: 'red' }}>授权不通过</span>
                    </Button>
                    <Button type="link" onClick={() => handleStatus(row, 2)}>授权通过</Button>
                  </> : null
              }
            </span>
          )} />
      </Table>
      <br />
      <Pagination
        total={total}
        pageSizeOptions={["10", "20", "40"]}
        showTotal={(total) => `共${total}条数据`}
        onChange={pageChange}
        current={page}
        onShowSizeChange={sizeChange}
        showSizeChanger
        showQuickJumper
      />
    </div>
  )
}

export default AuthCode;
import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  Button,
  Pagination,
  Modal,
  Select,
  message,
  Badge,
  Input
} from "antd";
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getAuthCodeList, updateAuthCodeStatus, getUserList } from "@/api/system";
import "./index.less";
const { Column } = Table;

const AuthCode = () => {
  const [form] = Form.useForm();
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [listQuery, setListQuery] = useState({ status: '', input: '' });

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
    setPage(1);
    setListQuery(state => ({ ...state, ...values }));
  }

  const resetData = () => {
    setPage(1);
    setListQuery({ status: '', input: '' });
    form.setFieldsValue({ status: '', input: '' });
  }

  const pageChange = (page, _) => {
    setPage(page);
  }

  const sizeChange = (_, size) => {
    setSize(size);
  }

  const handleStatus = (row, status) => {
    Modal.confirm({
      title:
        <div>
          你确认将授权码为 <span style={{ color: 'red' }}>{row.auth_code}</span> 标记为 {status === 2 ? '允许登录' : '拒绝登录'}？
          {
            status === 2 ?
              <div className="code-tips">标记为允许登录后，该账号即可通过改授权码设备进行公网登录访问</div> :
              <div className="code-tips">标记为拒绝登录，即拒绝该账号通过改授权码设备进行公网登录访问</div>
          }
        </div>,
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
        <Form.Item label="关键字:" name="input">
          <Input placeholder="请输入用户名称、账户、授权码搜索" style={{ width: 320 }} />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select style={{ width: 120 }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value={1}>待审核</Select.Option>
            <Select.Option value={2}>通过</Select.Option>
            <Select.Option value={3}>拒绝</Select.Option>
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
        size="small"
      >
        <Column title="用户名称" dataIndex="user_name" key="user_name" align="center" />
        <Column title="账户" dataIndex="account" key="account" align="center" />
        <Column title="角色" dataIndex="role" key="role" align="center" />
        <Column title="授权码" dataIndex="auth_code" key="auth_code" align="center" />
        <Column title="状态" dataIndex="status" key="status" align="center"
          render={
            status =>
              <span>
                {
                  status === 1 ? <Badge status="warning" text={<span style={{ color: '#faad14' }}>待审核</span>} /> :
                    status === 2 ? <Badge status="success" text={<span style={{ color: '#52c41a' }}>通过</span>} /> :
                      <Badge status="error" text={<span style={{ color: '#ff4d4f' }}>拒绝</span>} />
                }
              </span>
          }
        />
        <Column title="登录时间" dataIndex="create_time" key="create_time" align="center"
          render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
        />
        <Column title="操作" key="action" align="center"
          render={(text, row) => (
            <span>
              <Button type="link" disabled={row.status === 2} onClick={() => handleStatus(row, 2)}>允许登录</Button>
              <Button type="link" disabled={row.status === 3} onClick={() => handleStatus(row, 3)}>拒绝登录</Button>
            </span>
          )} />
      </Table>
      <br />
      <Pagination
        size="small"
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
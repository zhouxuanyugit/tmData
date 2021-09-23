import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Pagination,
  message,
  Select
} from "antd";
import moment from 'moment';
import AddEditForm from "./components/addEditForm";
import AccountFrom from "./components/passwordFrom";
import { getRoleList, getUserList, addUser, updateUser, updateUserStatus, updateUserPassWord } from "@/api/system";
import "./index.less";

const { Column } = Table;

class User extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    roleList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      index: 1,
      page_size: 10,
      status: '',
      role_id: ''
    },

    addEditModalVisible: false,
    addEditModalLoading: false,
    addEditData: {},

    passwordModalVisible: false,
    passwordModalLoading: false,
    passwordModalData: {}
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getUserList({ ...listQuery })
      .then((res) => {
        this.setState({ loading: false });
        const tableList = res.data.list;
        const total = res.data.count;
        if (this._isMounted) {
          this.setState({ tableList, total });
        }
      });
  }
  resetData = () => {
    this.setState({
      listQuery: {
        index: 1,
        page_size: 10,
        status: '',
        role_id: ''
      }
    }, () => { this.fetchData() })
  }
  componentDidMount() {
    this._isMounted = true;
    this.getRoleList();
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  getRoleList = () => {
    getRoleList({ index: 1, page_size: 9999 }).then((res) => {
      const roleList = res.data.list;
      this.setState({ roleList });
    })
  }
  filterStatusChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        status: value,
      }
    }));
  }
  filterRoleChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        role_id: value,
      }
    }));
  }
  changePage = (page, size) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          index: page,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  }
  changePageSize = (current, size) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          index: 1,
          page_size: size,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  }
  handleStatus = (row) => {
    updateUserStatus({ id: row.id, status: row.status === 1 ? 2 : 1 }).then((res) => {
      message.success(`${row.status === 2 ? '禁用' : '启用'}成功`);
      this.fetchData();
    })
  }
  handleEdit = (row) => {
    this.setState({
      addEditData: Object.assign({}, row),
      addEditModalVisible: true
    });
  }
  handleAdd = () => {
    this.setState({
      addEditData: {},
      addEditModalVisible: true
    });
  }
  handleAddEditOk = (values) => {
    this.setState({ addEditModalLoading: true, });
    if (values.id) {
      updateUser(values).then((res) => {
        if (res.code !== 200) {
          message.success(res.msg);
          this.setState({ addEditModalLoading: false });
        } else {
          message.success('编辑成功');
          this.setState({ addEditModalVisible: false, addEditModalLoading: false });
          this.fetchData();
        }
      })
    } else {
      addUser(values).then((res) => {
        if (res.code !== 200) {
          message.success(res.msg);
          this.setState({ addEditModalLoading: false });
        } else {
          message.success('添加成功');
          this.setState({ addEditModalVisible: false, addEditModalLoading: false });
          this.fetchData();
        }
      })
    }
  }
  handleAddEditCancel = _ => {
    this.setState({ addEditModalVisible: false });
  }
  handlePassword = (row) => {
    this.setState({
      passwordModalData: Object.assign({}, row),
      passwordModalVisible: true
    });
  }
  handlePasswordOk = (values) => {
    const { id, pass_word } = values;
    this.setState({ passwordModalLoading: true });
    updateUserPassWord({ id, pass_word }).then((res) => {
      message.success(`编辑成功`);
      this.setState({ passwordModalVisible: false, passwordModalLoading: false });
      this.fetchData();
    });
  }
  handlePasswordCancel = _ => {
    this.setState({ passwordModalVisible: false });
  }
  render() {
    const {
      roleList,
      listQuery,
      tableList,
      loading,
      total,
      addEditModalVisible,
      addEditModalLoading,
      addEditData,
      passwordModalVisible,
      passwordModalLoading,
      passwordModalData
    } = this.state;
    return (
      <div className="app-container">
        <Form layout="inline">
          <Form.Item label="状态:">
            <Select
              value={listQuery.status}
              style={{ width: 120 }}
              onChange={this.filterStatusChange}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value={2}>正常</Select.Option>
              <Select.Option value={1}>禁用中</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色:">
            <Select
              value={listQuery.role_id}
              style={{ width: 120 }}
              onChange={this.filterRoleChange}>
              <Select.Option value="">全部</Select.Option>
              {
                roleList.map((item, index) => (
                  <Select.Option value={item.id} key={index}>{item.role}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => {
              this.setState((state) => ({
                listQuery: {
                  ...state.listQuery,
                  index: 1
                },
              }), () => { this.fetchData() })
            }} //每次查询重置第一页
            >
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={this.resetData} >
              重置
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleAdd} >
              添加
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
          <Column title="用户名称" dataIndex="user_name" key="user_name" align="center" />
          <Column title="手机号（账户）" dataIndex="account" key="account" align="center" />
          <Column title="角色" dataIndex="role_id" key="role_id" align="center"
            render={(role_id) => <span>{roleList.map((item) => item.id === role_id ? item.role : '')}</span>}
          />
          <Column title="状态" dataIndex="status" key="status" align="center"
            render={(status) => <span>{status === 2 ? '正常' : '禁用'}</span>} />
          <Column title="创建时间" dataIndex="create_time" key="create_time" align="center"
            render={create_time => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss')} />
          <Column title="操作" key="action" align="center"
            render={(text, row) => (
              <span>
                <Button type="link" onClick={this.handleEdit.bind(null, row)}>编辑</Button>
                <Button type="link" onClick={this.handlePassword.bind(null, row)}>修改密码</Button>
                {
                  row.status === 2 ?
                    <Button type="link" onClick={this.handleStatus.bind(null, row)}>
                      <span style={{ color: 'red' }}>禁用</span>
                    </Button> :
                    <Button type="link" onClick={this.handleStatus.bind(null, row)}>启用</Button>
                }
              </span>
            )} />
        </Table>
        <br />
        <Pagination
          total={total}
          pageSizeOptions={["10", "20", "40"]}
          showTotal={(total) => `共${total}条数据`}
          onChange={this.changePage}
          current={listQuery.index}
          onShowSizeChange={this.changePageSize}
          showSizeChanger
          showQuickJumper
        />
        {
          addEditModalVisible ?
            <AddEditForm
              roleList={roleList}
              addEditData={addEditData}
              visible={addEditModalVisible}
              confirmLoading={addEditModalLoading}
              onCancel={this.handleAddEditCancel}
              onOk={this.handleAddEditOk}
            /> : null
        }
        {
          passwordModalVisible ?
            <AccountFrom
              passwordModalData={passwordModalData}
              visible={passwordModalVisible}
              confirmLoading={passwordModalLoading}
              onCancel={this.handlePasswordCancel}
              onOk={this.handlePasswordOk}
            /> : null
        }
      </div>
    )
  }
}

export default User;
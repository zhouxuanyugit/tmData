import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Select
} from "antd";
import moment from 'moment';
import AddEditForm from "./components/addEditForm";
import AccountFrom from "./components/accountFrom";
import ChargeBind from "./components/chargeBind";
import { formartMoney } from "@/utils";
import { getRoleList, getUserList, addUser, updateUser, updateUserStatus, getUserDetails } from "@/api/system";
import "./index.less";

const { Column } = Table;
const { Panel } = Collapse;

class User extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    roleList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      status: '',
      role_id: ''
    },

    addEditModalVisible: false,
    addEditModalLoading: false,
    addEditData: {},

    accountModalVisible: false,
    accountModalLoading: false,
    accountModalData: {},

    doctor_id: 0,
    chargeBindVisible: false,
    chargeBindData: [],
    currentMonthDays: 0
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getUserList({ ...listQuery })
      .then((res) => {
        this.setState({ loading: false });
        const tableList = res.data.list;
        const total = res.data.num;
        if (this._isMounted) {
          this.setState({ tableList, total });
        }
      });
  }
  resetData = () => {
    this.setState({
      listQuery: {
        page: 1,
        size: 10,
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
    getRoleList({ page: 1, size: 9999 }).then((res) => {
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
          page,
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
          page: 1,
          size,
        },
      }),
      () => {
        this.fetchData();
      }
    );
  }
  handleStatus = (row) => {
    updateUserStatus({ doctor_id: row.doctor_id, status: row.status === 1 ? 2 : 1 }).then((res) => {
      message.success(`${row.status === 1 ? '禁用' : '启用'}成功`);
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
      addEditData: { doctor_name: '', mobile: '', role_id: '' },
      addEditModalVisible: true
    });
  }
  handleAddEditOk = (values) => {
    this.setState({ addEditModalLoading: true, });
    if (values.doctor_id) {
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
  handleAccount = (row) => {
    this.setState({
      accountModalData: Object.assign({}, row),
      accountModalVisible: true
    });
  }
  handleAccountOk = (values) => {
    this.setState({ accountModalLoading: true, });
    updateUser(values).then((res) => {
      message.success(`编辑成功`);
      this.setState({ accountModalVisible: false, accountModalLoading: false });
      this.fetchData();
    });
  }
  handleAccountCancel = _ => {
    this.setState({ accountModalVisible: false });
  }
  handleChargeBind = (row) => {
    const { doctor_id } = row;
    getUserDetails({ doctor_id }).then((res) => {
      this.setState({
        chargeBindData: res.data.bind_month_tasktype.list,
        currentMonthDays: parseInt(res.data.bind_month_tasktype.total_day),
        chargeBindVisible: true,
        doctor_id
      });
    })
  }
  handleChargeBindOk = (values) => {
    const { doctor_id } = this.state;
    updateUser({ doctor_id, bind_month_tasktype: JSON.stringify(values) }).then((res) => {
      message.success(`绑定成功`);
      this.setState({ chargeBindVisible: false, accountModalLoading: false });
      this.fetchData();
    });
  }
  handleChargeBindCancel = _ => {
    this.setState({ chargeBindVisible: false });
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
      accountModalVisible,
      accountModalLoading,
      accountModalData,
      chargeBindVisible,
      chargeBindData,
      currentMonthDays
    } = this.state;
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="操作" key="1">
            <Form layout="inline">
              <Form.Item label="状态:">
                <Select
                  value={listQuery.status}
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>正常</Select.Option>
                  <Select.Option value={2}>禁用中</Select.Option>
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
                      <Select.Option value={item.role_id} key={index}>{item.role_name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => {
                  this.setState((state) => ({
                    listQuery: {
                      ...state.listQuery,
                      page: 1
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
          </Panel>
        </Collapse>
        <br />
        <Table
          bordered
          rowKey={(record) => record.doctor_id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          <Column title="用户名称" dataIndex="doctor_name" key="doctor_name" align="center" />
          <Column title="手机号（账户）" dataIndex="mobile" key="mobile" align="center" />
          <Column title="角色" dataIndex="role_id" key="role_id" align="center"
            render={(role_id) => <span>{roleList.map((item) => item.role_id === role_id ? item.role_name : '')}</span>}
          />
          <Column title="账户余额（元）" dataIndex="money" key="money" align="center" render={(money) => <span>{formartMoney(money)}</span>} />
          <Column title="状态" dataIndex="status" key="status" align="center" render={(status) => <span>{status === 1 ? '正常' : '禁用'}</span>} />
          <Column title="创建时间" dataIndex="create_time" key="create_time" align="center" render={create_time => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss')} />
          <Column title="操作" key="action" align="center" render={(text, row) => (
            <span>
              <Button type="link" onClick={this.handleEdit.bind(null, row)}>编辑</Button>
              <Button type="link" onClick={this.handleAccount.bind(null, row)}>收款账号</Button>
              <Button type="link" onClick={this.handleChargeBind.bind(null, row)}>费用绑定</Button>
              {
                row.status === 1 ?
                  <Button type="link" onClick={this.handleStatus.bind(null, row)}><span style={{ color: 'red' }}>禁用</span></Button> :
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
          current={listQuery.page}
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
          accountModalVisible ?
            <AccountFrom
              accountModalData={accountModalData}
              visible={accountModalVisible}
              confirmLoading={accountModalLoading}
              onCancel={this.handleAccountCancel}
              onOk={this.handleAccountOk}
            /> : null
        }
        {
          chargeBindVisible ?
            <ChargeBind
              chargeBindData={chargeBindData}
              currentMonthDays={currentMonthDays}
              visible={chargeBindVisible}
              onCancel={this.handleChargeBindCancel}
              onOk={this.handleChargeBindOk}
            /> : null
        }
      </div>
    )
  }
}

export default User;
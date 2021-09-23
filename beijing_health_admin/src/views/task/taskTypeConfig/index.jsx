import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Select,
  Badge
} from "antd";
import moment from 'moment';
import AddEditForm from "./components/addEditForm";
import { getTaskTypeList, addTaskType, updateTaskType } from "@/api/task";
import { formartMoney } from "@/utils";
const { Column } = Table;
const { Panel } = Collapse;

class TaskTypeConfig extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      status: '',
      charge_type: ''
    },

    addEditModalVisible: false,
    addEditModalLoading: false,
    addEditData: {}
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getTaskTypeList({ ...listQuery })
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
        charge_type: ''
      }
    }, () => { this.fetchData(); })
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterStatusChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        status: value,
      }
    }));
  }
  filterChargeModeChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        charge_type: value,
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
    updateTaskType({ type_id: row.type_id, status: row.status === 1 ? 2 : 1 }).then((res) => {
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
      addEditData: { type_name: '', charge_type: 1, charge_money: '' },
      addEditModalVisible: true
    });
  }
  handleAddEditOk = (values) => {
    this.setState({ addEditModalLoading: true, });

    if (values.type_id) {
      updateTaskType({ ...values }).then(() => {
        message.success('编辑成功');
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      })
    } else {
      addTaskType({ ...values }).then(() => {
        message.success('添加成功');
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      })
    }
  }
  handleAddEditCancel = _ => {
    this.setState({ addEditModalVisible: false });
  }
  render() {
    const { listQuery, tableList, loading, total, addEditModalVisible, addEditModalLoading, addEditData } = this.state;
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
              <Form.Item label="付费模式:">
                <Select
                  value={listQuery.charge_type}
                  style={{ width: 120 }}
                  onChange={this.filterChargeModeChange}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>按次付费</Select.Option>
                  <Select.Option value={2}>按月付费</Select.Option>
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
          rowKey={(record) => record.type_id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          {/* <Column title="序号" dataIndex="id" key="id" width={80} align="center" /> */}
          <Column title="类型名称" dataIndex="type_name" key="type_name" align="center" />
          <Column title="付费模式" dataIndex="charge_type" key="charge_type" align="center"
            render={(charge_type) => <span>{charge_type === 1 ? '按次付费' : '按月付费'}</span>}
          />
          <Column title="付费金额" dataIndex="charge_money" key="charge_money" align="center"
            render={(charge_money) => <span>{formartMoney(charge_money)}</span>}
          />
          <Column title="状态" dataIndex="status" key="status" align="center"
            render={(status) =>
              <span>
                {
                  status === 1 ?
                    <span style={{ color: '#52c41a' }}><Badge status="success" />正常</span> :
                    <span style={{ color: '#ff4d4f' }}><Badge status="error" />禁用中</span>
                }
              </span>
            }
          />
          <Column title="创建时间" dataIndex="create_time" key="create_time" align="center"
            render={create_time => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="操作" key="action" align="center" render={(text, row) => (
            <span>
              <Button type="link" onClick={this.handleEdit.bind(null, row)}>编辑</Button>
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
              addEditData={addEditData}
              visible={addEditModalVisible}
              confirmLoading={addEditModalLoading}
              onCancel={this.handleAddEditCancel}
              onOk={this.handleAddEditOk}
            /> : null
        }
      </div>
    )
  }
}

export default TaskTypeConfig;
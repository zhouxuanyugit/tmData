import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Select,
  Badge,
  Modal
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getTypeConfigList, addTypeConfig, updateTypeConfig } from "@/api/charge";
import AddEditForm from "./components/addEditForm";
const { Column } = Table;
const { Panel } = Collapse;

class TypeConfig extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      status: ''
    },

    addEditModalVisible: false,
    addEditModalLoading: false,
    addEditData: {}
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getTypeConfigList({ ...listQuery }).then((res) => {
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
        status: ''
      }
    }, () => { this.fetchData(); });
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
        status: value
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
    updateTypeConfig({ type_id: row.type_id, status: row.status === 1 ? 2 : 1 }).then((res) => {
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
      addEditData: { expense_name: '', sort_id: 0 },
      addEditModalVisible: true
    });
  }
  handleAddEditOk = (values) => {
    this.setState({ addEditModalLoading: true, });

    if (values.type_id) {
      updateTypeConfig({ ...values }).then((res) => {
        message.success(`编辑成功`);
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      })
    } else {
      addTypeConfig({ ...values }).then((res) => {
        message.success(`添加成功`);
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      })
    }
  }
  handleAddEditCancel = _ => {
    this.setState({ addEditModalVisible: false });
  }
  handleDelete = (row) => {
    Modal.confirm({
      title: <div>你确认要对 <span style={{ color: 'red' }}>{row.expense_name}</span> 费用进行删除！</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        updateTypeConfig({ type_id: row.type_id, status: 10 }).then((res) => {
          message.success(`删除成功`);
          this.fetchData();
        })
      }
    });
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
          <Column title="序号" dataIndex="sort_id" key="sort_id" width={80} align="center" />
          <Column title="费用名称" dataIndex="expense_name" key="expense_name" align="center" />
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
                  <Button type="link" onClick={this.handleStatus.bind(null, row)}><span style={{ color: 'red' }}>禁用</span></Button>
                  :
                  <>
                    <Button type="link" onClick={this.handleStatus.bind(null, row)}>启用</Button>
                    <Button type="link" onClick={this.handleDelete.bind(null, row)}>删除</Button>
                  </>
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

export default TypeConfig;
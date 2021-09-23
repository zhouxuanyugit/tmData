import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Input
} from "antd";
import moment from 'moment';
import { getExternalUserList, addExternalUser, updateExternalUser } from "@/api/system";
import AddEditForm from "./components/addEditForm";

const { Column } = Table;
const { Panel } = Collapse;

class ExternalUser extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      search_name: ''
    },

    addEditModalVisible: false,
    addEditModalLoading: false,
    addEditData: {},
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getExternalUserList({ ...listQuery }).then((res) => {
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
        search_name: ''
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
  filterInputChange = (e) => {
    let value = e.target.value;
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        search_name: value,
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
  handleDelete = (row) => {
    const { member_id } = row;
    updateExternalUser({ member_id, status: 5 }).then(res => {
      message.success("删除成功");
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
      addEditData: { userName: '', phoneNum: '', des: '' },
      addEditModalVisible: true
    });
  }
  handleAddEditOk = (values) => {
    this.setState({ addEditModalLoading: true, });
    if (values.member_id) {
      updateExternalUser({ ...values }).then(() => {
        message.success(`编辑成功`);
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      });
    } else {
      addExternalUser({ ...values }).then(() => {
        message.success(`添加成功`);
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      });
    }
  }
  handleAddEditCancel = _ => {
    this.setState({ addEditModalVisible: false });
  }
  render() {
    const {
      listQuery,
      tableList,
      loading,
      total,
      addEditModalVisible,
      addEditModalLoading,
      addEditData,
    } = this.state;
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="操作" key="1">
            <Form layout="inline">
              <Form.Item label="">
                <Input
                  style={{ width: 300 }}
                  value={listQuery.search_name}
                  onChange={this.filterInputChange}
                  placeholder="请输入成员名称或电话搜索"
                />
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
          rowKey={(record) => record.member_id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          <Column title="成员名称" dataIndex="member_name" key="member_name" align="center" />
          <Column title="成员介绍" dataIndex="member_brief" key="member_brief" align="center" width={500} />
          <Column title="手机号" dataIndex="mobile" key="mobile" align="center" />
          <Column title="录入时间" dataIndex="create_time" key="create_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="操作" key="action" align="center" render={(text, row) => (
            <span>
              <Button type="link" onClick={this.handleEdit.bind(null, row)}>编辑</Button>
              <Button type="link" onClick={this.handleDelete.bind(null, row)}>删除</Button>
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

export default ExternalUser;
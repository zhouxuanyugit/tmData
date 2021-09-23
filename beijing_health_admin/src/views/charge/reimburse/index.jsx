import React, { Component } from "react";
import {
  Table,
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Select,
  DatePicker,
  Input,
  Badge,
  Modal
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import { getReimburseList, updateReimburse } from "@/api/charge";
import DetailsInfoModal from "./components/detailsInfoModal";
const { Column } = Table;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
  },
  getCheckboxProps: (record) => ({
    // disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.expense_id,
  }),
};

class Reimburse extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    rowSelection: undefined, //前面checkbox选项
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      search_name: '',
      status: '',
      start_time: '',
      end_time: ''
    },

    expense_id: 0,
    rejectVisible: false,
    rejectValue: '',

    detailsVisible: false,
    detailsValue: {}
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getReimburseList({ ...listQuery }).then((res) => {
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
        search_name: '',
        status: '',
        start_time: '',
        end_time: ''
      },
      rowSelection: undefined,
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
  filterStatusChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        status: value
      },
      rowSelection: value ? { ...rowSelection } : undefined //判断选择全部的话就不显示前面状态框
    })); //如果有批量操作，需要实时更新结果
  }
  filterDateRangeChange = (dates, dateStrings) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        start_time: moment(dates[0]).startOf('day').unix(),
        end_time: moment(dates[1]).endOf('day').unix()
      }
    }));
  };
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
  handleDetails = (row) => {
    this.setState({ detailsVisible: true, detailsValue: row });
  }
  handlePass = (row) => {
    Modal.confirm({
      title: '确认审核通过？',
      icon: <ExclamationCircleOutlined />,
      content: <div>
        <span style={{ color: 'red' }}>审核通过后，系统将自动向服务人员发放该次服务对应的服务费</span>，你还要继续吗？
      </div>,
      okText: '继续',
      cancelText: '取消',
      onOk: () => {
        const { expense_id } = row;
        updateReimburse({ expense_id: expense_id, status: 2 }).then(() => {
          message.success('审核成功');
          this.fetchData();
        })
      },
    });
  }
  handleReject = (row) => {
    this.setState({ rejectVisible: true, rejectValue: '', expense_id: row.expense_id });
  }
  changeRejectValue = (e) => {
    let rejectValue = e.target.value;
    this.setState({ rejectValue });
  }
  handleOkReject = () => {
    const { expense_id, rejectValue } = this.state;
    updateReimburse({ expense_id, status: 10, verify_fail_reason: rejectValue }).then(() => {
      message.success('驳回成功');
      this.setState({ rejectVisible: false });
      this.fetchData();
    })
  }
  handleRejectReason = (row) => {
    Modal.info({
      title: '驳回理由',
      content: (
        <div>
          <p>{row.verify_fail_reason}</p>
        </div>
      ),
      okText: '关闭',
      onOk() { },
    });
  }
  render() {
    const { listQuery, tableList, loading, total, rejectVisible, rejectValue, detailsVisible, detailsValue } = this.state;
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
                  placeholder="请输入报销说明/执行人/关联任务搜索"
                />
              </Form.Item>
              <Form.Item label="状态:">
                <Select
                  value={listQuery.status}
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>待审核</Select.Option>
                  <Select.Option value={2}>审核通过</Select.Option>
                  <Select.Option value={10}>已驳回</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="发起时间:">
                <RangePicker
                  value={[listQuery.start_time && moment(listQuery.start_time * 1000), listQuery.end_time && moment(listQuery.end_time * 1000)]}
                  onChange={this.filterDateRangeChange}
                  allowClear={false}
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
              {/* {
                listQuery.status === 1 ?
                  <>
                    <Form.Item>
                      <Button type="primary" onClick={this.fetchData}>
                        审核通过
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={this.resetData} >
                        驳回
                      </Button>
                    </Form.Item>
                  </> : null
              } */}

            </Form>
          </Panel>
        </Collapse>
        <br />
        <div></div>
        <Table
          bordered
          // rowSelection={rowSelection} //暂时不做批量操作
          rowKey={(record) => record.expense_id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          <Column title="报销说明" dataIndex="expense_describe" key="expense_describe" align="center" width={300}/>
          <Column title="关联任务" dataIndex="task_describe" key="task_describe" align="center" />
          <Column title="费用类别" dataIndex="expense_type_name" key="expense_type_name" align="center" />
          <Column title="报销金额（元）" dataIndex="expense_money" key="expense_money" align="center"
            render={(item) => <span>{item}</span>}
          />
          <Column title="报销人" dataIndex="doctor_name" key="doctor_name" align="center" />
          <Column title="发起时间" dataIndex="create_time" key="create_time" align="center"
            render={item => moment(item).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="状态" dataIndex="status" key="status" align="center"
            render={
              (item) => {
                if (item === 1) {
                  return <span style={{ color: '#faad14' }}><Badge status="warning" />待审核</span>
                }
                if (item === 2) {
                  return <span style={{ color: '#1890ff' }}><Badge status="processing" />审核通过</span>
                }
                if (item === 10) {
                  return <span style={{ color: '#ff4d4f' }}><Badge status="error" />已驳回</span>
                }
              }
            } />
          <Column title="操作" key="action" align="center" render={(text, row) => (
            <span>
              <Button type="link" onClick={this.handleDetails.bind(null, row)}>详情</Button>
              {
                row.status === 10 ? <Button type="link" onClick={this.handleRejectReason.bind(null, row)}>驳回理由</Button> : null
              }
              {
                row.status === 1 ?
                  <>
                    <Button type="link" onClick={this.handlePass.bind(null, row)}>审核通过</Button>
                    <Button type="link" onClick={this.handleReject.bind(null, row)}>驳回</Button>
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
          onChange={this.changePage}
          current={listQuery.page}
          onShowSizeChange={this.changePageSize}
          showSizeChanger
          showQuickJumper
        />
        <Modal
          title="驳回理由"
          maskClosable={false}
          visible={rejectVisible}
          onOk={this.handleOkReject}
          onCancel={() => this.setState({ rejectVisible: false })}
          okText="确认"
          cancelText="取消"
        >
          <TextArea
            showCount
            maxLength={100}
            value={rejectValue}
            onChange={this.changeRejectValue}
            autoSize={{ minRows: 2, maxRows: 4 }} />
        </Modal>
        <DetailsInfoModal 
          visible={detailsVisible}
          onCancel={() => this.setState({ detailsVisible: false })}
          detailsValue={detailsValue}
        />
      </div>
    )
  }
}

export default Reimburse;
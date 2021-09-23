import React, { Component } from "react";
import {
  Form,
  Button,
  Collapse,
  Pagination,
  message,
  Select,
  DatePicker,
  Input,
  Row,
  Col,
  Modal
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getTaskTypeList, getTaskList, updateTask } from "@/api/task";
import DetailsInfoModal from "./components/detailsInfoModal";
import RejectReasonModal from "./components/rejectReasonModal";
import TableList from "./components/tableList";
import moment from 'moment';
import "./index.less";
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

class TaskList extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    taskTypeList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      task_describe: '',
      task_type_id: '',
      status: '',
      task_charge_type: '',
      start_time: '',
      end_time: ''
    },

    task_id: 0,
    rejectVisible: false,
    rejectValue: '',

    detailsVisible: false,
    detailsValue: {}

  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getTaskList({ ...listQuery }).then((res) => {
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
        task_describe: '',
        task_type_id: '',
        status: '',
        task_charge_type: '',
        start_time: '',
        end_time: ''
      }
    }, () => { this.fetchData(); })
  }
  getTaskTypeList = () => {
    getTaskTypeList({ page: 1, size: 9999 })
      .then((res) => {
        const taskTypeList = res.data.list;
        this.setState({ taskTypeList });
      });
  }
  componentDidMount() {
    this._isMounted = true;
    this.getTaskTypeList();
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterInputChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        task_describe: value,
      }
    }));
  }
  filterTaskTypeChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        task_type_id: value,
      }
    }));
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
        task_charge_type: value,
      }
    }));
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
    this.setState({ detailsValue: row, detailsVisible: true });
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
        const { task_id } = row;
        updateTask({ task_id, status: 5 }).then(() => {
          message.success('审核成功');
          this.fetchData();
        })
      },
    });
  }
  handleReject = (row) => {
    this.setState({ rejectVisible: true, rejectValue: '', task_id: row.task_id });
  }
  changeRejectValue = (e) => {
    let rejectValue = e.target.value;
    this.setState({ rejectValue });
  }
  handleOkReject = () => {
    const { task_id, rejectValue } = this.state;
    updateTask({ task_id, status: 10, verify_fail_reason: rejectValue }).then(() => {
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
    const { listQuery, taskTypeList, tableList, loading, total, rejectVisible, rejectValue, detailsVisible, detailsValue } = this.state;
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="操作" key="1">
            <Row>
              <Col span={24}>
                <Form layout="inline">
                  <Form.Item label="">
                    <Input
                      style={{ width: 300 }}
                      value={listQuery.task_describe}
                      onChange={this.filterInputChange}
                      placeholder="请输入任务描述搜索"
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col span={20}>
                <Form layout="inline">
                  <Form.Item label="任务类型:">
                    <Select
                      value={listQuery.task_type_id}
                      style={{ width: 120 }}
                      onChange={this.filterTaskTypeChange}>
                      <Select.Option value="">全部</Select.Option>
                      {
                        taskTypeList.map((item) => {
                          return (
                            <Select.Option value={item.type_id} key={item.type_id}>{item.type_name}</Select.Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item label="状态:">
                    <Select
                      value={listQuery.status}
                      style={{ width: 120 }}
                      onChange={this.filterStatusChange}>
                      <Select.Option value="">全部</Select.Option>
                      <Select.Option value={1}>进行中</Select.Option>
                      <Select.Option value={4}>待审核</Select.Option>
                      <Select.Option value={5}>审核通过</Select.Option>
                      <Select.Option value={10}>已驳回</Select.Option>
                      <Select.Option value={3}>已取消</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="付费模式:">
                    <Select
                      value={listQuery.task_charge_type}
                      style={{ width: 120 }}
                      onChange={this.filterChargeModeChange}>
                      <Select.Option value="">全部</Select.Option>
                      <Select.Option value={1}>按次付费</Select.Option>
                      <Select.Option value={2}>按月付费</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="发起时间:">
                    <RangePicker
                      value={[listQuery.start_time && moment(listQuery.start_time * 1000), listQuery.end_time && moment(listQuery.end_time * 1000)]}
                      onChange={this.filterDateRangeChange}
                      allowClear={false}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={4}>
                <Form layout="inline" style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                </Form>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <br />
        <TableList
          tableList={tableList}
          loading={loading}
          handleDetails={this.handleDetails}
          handleRejectReason={this.handleRejectReason}
          handlePass={this.handlePass}
          handleReject={this.handleReject}
        />
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
        <RejectReasonModal
          visible={rejectVisible}
          onOk={this.handleOkReject}
          onCancel={() => this.setState({ rejectVisible: false })}
          value={rejectValue}
          onChange={this.changeRejectValue}
        />
        <DetailsInfoModal
          detailsValue={detailsValue}
          visible={detailsVisible}
          onCancel={() => this.setState({ detailsVisible: false })}
        />
      </div>
    )
  }
}

export default TaskList;
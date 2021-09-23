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
import FinishCashout from "./components/finishCashout";
import moment from 'moment';
import { getCashoutList, updateCashout } from "@/api/charge";
import { formartMoney } from "@/utils";
import DetailsInfoModal from "./components/detailsInfoModal";
import "./index.less";
const { Column } = Table;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

class Cashout extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      doctor_name: '',
      status: '',
      start_time: '',
      end_time: ''
    },

    crash_id: 0,
    rejectVisible: false,
    rejectValue: '',

    detailsVisible: false,
    detailsValue: {},

    finishCashoutVisible: false,
    finishCashoutLoading: false,
    finishCashoutInfo: {}
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getCashoutList({ ...listQuery }).then((res) => {
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
        doctor_name: '',
        status: '',
        start_time: '',
        end_time: ''
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
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        doctor_name: value,
      }
    }));
  }
  filterStatusChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        status: value
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
    this.setState({ detailsVisible: true, detailsValue: row });
  }
  handlePass = (row) => {
    Modal.confirm({
      title: '确认审核通过？',
      icon: <ExclamationCircleOutlined />,
      content: <div>
        <span style={{ color: 'red' }}>审核通过后，订单将变为打款中状态</span>，你还要继续吗？
      </div>,
      okText: '继续',
      cancelText: '取消',
      onOk: () => {
        const { crash_id } = row;
        updateCashout({ crash_id, status: 2 }).then(() => {
          this.fetchData();
        });
      },
    });
  }
  handleReject = (row) => {
    Modal.confirm({
      title: '确认退回？',
      icon: <ExclamationCircleOutlined />,
      content: <div>
        <span style={{ color: 'red' }}>退回后，订单将变为已退回状态</span>，你还要继续吗？
      </div>,
      okText: '继续',
      cancelText: '取消',
      onOk: () => {
        const { crash_id } = row;
        updateCashout({ crash_id, status: 10 }).then(() => {
          this.fetchData();
        });
      },
    });
  }

  handleFinishCashout = (row) => {
    this.setState({ finishCashoutVisible: true, finishCashoutInfo: row, crash_id: row.crash_id });
  }
  handleFinishCashoutOk = (values) => {
    const { crash_id } = this.state;
    this.setState({ finishCashoutLoading: true, });
    updateCashout({ crash_id, status: 3, ...values }).then(() => {
      message.success('打款成功');
      this.setState({ finishCashoutVisible: false, finishCashoutLoading: false });
      this.fetchData();
    })
  }
  handleFinishCashoutCancel = () => {
    this.setState({ finishCashoutVisible: false });
  }

  render() {
    const {
      listQuery,
      tableList,
      loading,
      total,
      detailsVisible,
      finishCashoutVisible,
      finishCashoutLoading,
      finishCashoutInfo,
      detailsValue
    } = this.state;
    return (
      <div className="app-container">
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="操作" key="1">
            <Form layout="inline">
              <Form.Item label="">
                <Input
                  style={{ width: 300 }}
                  value={listQuery.doctor_name}
                  onChange={this.filterInputChange}
                  placeholder="请输入发起人搜索"
                />
              </Form.Item>
              <Form.Item label="状态:">
                <Select
                  value={listQuery.status}
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>审核中</Select.Option>
                  <Select.Option value={2}>打款中</Select.Option>
                  <Select.Option value={3}>打款完成</Select.Option>
                  <Select.Option value={10}>已退回</Select.Option>
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
            </Form>
          </Panel>
        </Collapse>
        <br />
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          <Column title="流水号" dataIndex="crash_id" key="crash_id" align="center" />
          <Column title="发起时间" dataIndex="create_time" key="create_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="发起人" dataIndex="doctor_name" key="doctor_name" align="center" />
          <Column title="提现金额（元）" dataIndex="crash_money" key="crash_money" align="center"
            render={(item) => <span>{formartMoney(item)}</span>}
          />
          <Column title="账户余额（元）" dataIndex="doctor_balance" key="doctor_balance" align="center"
            render={(item) => <span>{formartMoney(item)}</span>}
          />
          <Column title="状态" dataIndex="status" key="status" align="center"
            render={
              (item) => {
                if (item === 1) {
                  return <span style={{ color: '#faad14' }}><Badge status="warning" />审核中</span>
                }
                if (item === 2) {
                  return <span style={{ color: '#1890ff' }}><Badge status="processing" />打款中</span>
                }
                if (item === 10) {
                  return <span style={{ color: '#ff4d4f' }}><Badge status="error" />已退回</span>
                }
                if (item === 3) {
                  return <span style={{ color: '#d9d9d9' }}><Badge status="default" />打款完成</span>
                }
              }
            } />
          <Column title="操作" key="action" align="center" render={(text, row) => (
            <span>
              {
                row.status === 1 ?
                  <>
                    <Button type="link" onClick={this.handlePass.bind(null, row)}>审核通过</Button>
                    <Button type="link" onClick={this.handleReject.bind(null, row)}>退回</Button>
                  </> : null
              }
              {
                row.status === 2 ?
                  <>
                    <Button type="link" onClick={this.handleFinishCashout.bind(null, row)}>完成打款</Button>
                    <Button type="link" onClick={this.handleReject.bind(null, row)}>退回</Button>
                  </> : null
              }
              {
                row.status === 3 ? <Button type="link" onClick={this.handleDetails.bind(null, row)}>打款明细</Button> : null
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
          finishCashoutVisible ?
            <FinishCashout
              visible={finishCashoutVisible}
              confirmLoading={finishCashoutLoading}
              onCancel={this.handleFinishCashoutCancel}
              onOk={this.handleFinishCashoutOk}
              finishCashoutInfo={finishCashoutInfo}
            /> : null
        }
        <DetailsInfoModal
          visible={detailsVisible}
          onCancel={() => this.setState({ detailsVisible: false })}
          detailsValue={detailsValue}
        />
      </div>
    )
  }
}

export default Cashout;
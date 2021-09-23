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
import FinishPayModal from "./components/finishPayModal";
import moment from 'moment';
import { getPayList, updatePay } from "@/api/charge";
import { formartMoney } from "@/utils";
import DetailsInfoModal from "./components/detailsInfoModal";
import "./index.less";
const { Column } = Table;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class Pay extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
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

    pay_id: 0,
    rejectVisible: false,
    rejectValue: '',

    detailsVisible: false,
    detailsValue: {},

    finishPayVisible: false,
    finishPayLoading: false,
    finishPayInfo: {}
  }
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getPayList({ ...listQuery }).then((res) => {
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
        search_name: value,
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
  handleFinishPay = (row) => {
    this.setState({ finishPayVisible: true, finishPayInfo: row, pay_id: row.pay_id });
  }
  handleFinishPayOk = (values) => {
    const { pay_id } = this.state;
    this.setState({ finishPayLoading: true, });
    updatePay({ pay_id, status: 3, ...values }).then(() => {
      message.success('付费成功');
      this.setState({ finishPayVisible: false, finishPayLoading: false });
      this.fetchData();
    })
  }
  handleFinishPayCancel = () => {
    this.setState({ finishPayVisible: false });
  }

  handleDetails = (row) => {
    this.setState({ detailsVisible: true, detailsValue: row });
  }

  handleReject = (row) => {
    this.setState({ rejectVisible: true, rejectValue: '', pay_id: row.pay_id });
  }
  changeRejectValue = (e) => {
    let rejectValue = e.target.value;
    this.setState({ rejectValue });
  }
  handleOkReject = () => {
    const { pay_id, rejectValue } = this.state;
    updatePay({ pay_id, status: 10, verify_fail_reason: rejectValue }).then(() => {
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
    const {
      listQuery,
      tableList,
      loading,
      total,
      finishPayVisible,
      finishPayLoading,
      rejectVisible,
      rejectValue,
      detailsVisible,
      detailsValue,
      finishPayInfo
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
                  placeholder="请输入付费说明/上报人/关联任务搜索"
                />
              </Form.Item>
              <Form.Item label="状态:">
                <Select
                  value={listQuery.status}
                  style={{ width: 120 }}
                  onChange={this.filterStatusChange}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={1}>审核中</Select.Option>
                  <Select.Option value={3}>付费完成</Select.Option>
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
            </Form>
          </Panel>
        </Collapse>
        <br />
        <Table
          bordered
          rowKey={(record) => record.pay_id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          <Column title="付费说明" dataIndex="pay_describe" key="pay_describe" align="center" width={300}/>
          <Column title="关联任务" dataIndex="task_describe" key="task_describe" align="center" />
          <Column title="付费金额（元）" dataIndex="pay_money" key="pay_money" align="center"
            render={(item) => <span>{formartMoney(item)}</span>}
          />
          <Column title="上报人" dataIndex="doctor_name" key="doctor_name" align="center" />
          <Column title="发起时间" dataIndex="create_time" key="create_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="状态" dataIndex="status" key="status" align="center"
            render={
              (item) => {
                if (item === 1) {
                  return <span style={{ color: '#faad14' }}><Badge status="warning" />审核中</span>
                }
                if (item === 3) {
                  return <span style={{ color: '#1890ff' }}><Badge status="processing" />付费完成</span>
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
                    <Button type="link" onClick={this.handleFinishPay.bind(null, row)}>完成付费</Button>
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
        {
          finishPayVisible ?
            <FinishPayModal
              visible={finishPayVisible}
              confirmLoading={finishPayLoading}
              onCancel={this.handleFinishPayCancel}
              onOk={this.handleFinishPayOk}
              finishPayInfo={finishPayInfo}
            /> : null
        }
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

export default Pay;
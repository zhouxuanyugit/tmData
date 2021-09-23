import React, { Component } from 'react';
import {
  Table,
  Form,
  Button,
  Pagination,
  DatePicker,
  Input,
  Select
} from "antd";
import moment from 'moment';
import { getExpertList, getConsultationList } from "@/api/consultation";
import AddModal from './components/addModal';
import "./index.less";
const { Column } = Table;
const { RangePicker } = DatePicker;

class ConsultationList extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    expertList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      index: 1,
      page_size: 10,
      expert_id: this.props.location.state ? this.props.location.state.id : '',
      start_time: '',
      end_time: '',
      organization: ''
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
    this.getExpertData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const result = await getConsultationList({ ...this.state.listQuery });
    if (this._isMounted) {
      this.setState({
        loading: false,
        tableList: result.data.list,
        total: result.data.count
      });
    }
  }

  getExpertData = async () => {
    const result = await getExpertList({ index: 1, page_size: 9999, name: '' });
    const expertList = result.data.list;
    this.setState({ expertList });
  }

  resetData = () => {
    this.setState(
      (state) => ({
        listQuery: {
          index: 1,
          page_size: 10,
          expert_id: this.props.location.state ? this.props.location.state.id : '',
          start_time: '',
          end_time: '',
          organization: ''
        },
      }),
      () => {
        this.fetchData();
      });
  }

  filterInputChange = (e) => {
    let value = e.target.value;
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        organization: value
      }
    }));
  }

  filterDateRangeChange = (dates, dateStrings) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        start_time: moment(dates[0]).unix(),
        end_time: moment(dates[1]).unix()
      }
    }));
  }

  filterDoctorChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        expert_id: value
      }
    }));
  }

  changePage = (page, size) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          index: page
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
          page_size: size
        },
      }),
      () => {
        this.fetchData();
      }
    );
  }

  render() {
    const {
      expertList,
      tableList,
      loading,
      total,
      listQuery
    } = this.state;
    return (
      <div className="app-container">
        <Form layout="inline">
          <Form.Item label="机构名称：">
            <Input
              style={{ width: 300 }}
              value={listQuery.organization}
              onChange={this.filterInputChange}
              placeholder="请输入机构名称搜索"
            />
          </Form.Item>
          <Form.Item label="发起时间:">
            <RangePicker
              value={[listQuery.start_time && moment(listQuery.start_time * 1000), listQuery.end_time && moment(listQuery.end_time * 1000)]}
              onChange={this.filterDateRangeChange}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item label="下嘱医生:">
            <Select
              value={listQuery.expert_id}
              style={{ width: 120 }}
              onChange={this.filterDoctorChange}>
              <Select.Option value="">全部</Select.Option>
              {
                expertList.map(item => (<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>))
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
        </Form>
        <br />
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
          size="small"
          scroll={{ y: 230 }}
        >
          <Column title="会诊时间" dataIndex="union_time" key="union_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD')}
          />
          <Column title="会诊专家" dataIndex="expert_content" key="expert_content" align="center" />
          <Column title="机构名称" dataIndex="organization" key="organization" align="center" />
          <Column title="医嘱时间" dataIndex="create_time" key="create_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="下嘱医生" dataIndex="sign_expert" key="sign_expert" align="center" />
          <Column title="备注" dataIndex="remarks" key="remarks" align="center" />
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
          size="small"
        />

        <AddModal
          fetchData={this.fetchData}
        />
      </div>
    )
  }
}

export default ConsultationList;
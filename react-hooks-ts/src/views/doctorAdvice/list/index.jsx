import React, { Component } from 'react';
import {
  Table,
  Form,
  Button,
  Pagination,
  DatePicker,
  Select,
  Radio,
  Space
} from "antd";
import moment from 'moment';
import AddModal from './components/addModal';
import { getPatientList } from "@/api/patient";
import { getUserList } from "@/api/system";
import { getDoctorAdviceList } from "@/api/doctorAdvice";
import "./index.less";
const { Column } = Table;
const { RangePicker } = DatePicker;
const { Option } = Select;

class DoctorAdviceList extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    patientList: [],
    doctorList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      index: 1,
      page_size: 10,
      patient_id: this.props.location.state ? this.props.location.state.id : undefined,
      start_time: '',
      end_time: '',
      sign_doctor: '',
      say_type: parseInt(this.props.match.params.type),
      time_type: '1'
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
    this.getPatientData();
    this.getDoctorData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const result = await getDoctorAdviceList({ ...this.state.listQuery, time_type: parseInt(this.state.listQuery.time_type) });
    if (this._isMounted) {
      this.setState({
        loading: false,
        tableList: result.data.list,
        total: result.data.count
      });
    }
  }

  getPatientData = async () => {
    const result = await getPatientList({ index: 1, page_size: 9999, code: '' });
    const patientList = result.data.list;
    this.setState({ patientList });
  }

  getDoctorData = async () => {
    const result = await getUserList({ index: 1, page_size: 9999, status: 2, role_id: '' });
    const doctorList = result.data.list;
    this.setState({ doctorList })
  }

  resetData = () => {
    this.setState(
      (state) => ({
        listQuery: {
          index: 1,
          page_size: 10,
          patient_id: '',
          start_time: '',
          end_time: '',
          sign_doctor: '',
          say_type: parseInt(this.props.match.params.type),
          time_type: '1'
        },
      }),
      () => {
        this.fetchData();
      });
  }

  filterInputChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        patient_id: value
      }
    }), () => { this.fetchData() });
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
        sign_doctor: value
      }
    }));
  }

  filterCategoryChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        say_type: value
      }
    }));
  }

  onChangeTabs = (e) => {
    this.setState(
      (state) => ({
        listQuery: {
          ...state.listQuery,
          time_type: e.target.value,
        },
      }),
      () => {
        this.fetchData();
      })
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

  render() {
    const {
      patientList,
      doctorList,
      tableList,
      loading,
      total,
      listQuery
    } = this.state;
    return (
      <div className="app-container" >
        <Form layout="inline">
          <Form.Item label="患者代号：">
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="请选择一个患者代号"
              optionFilterProp="children"
              value={listQuery.patient_id}
              onChange={this.filterInputChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                patientList.map(item => (
                  <Option value={item.id} key={item.id}>{item.code}</Option>
                ))
              }
            </Select>
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
              value={listQuery.sign_doctor}
              style={{ width: 120 }}
              onChange={this.filterDoctorChange}>
              <Select.Option value="">全部</Select.Option>
              {
                doctorList.map(item => (
                  <Select.Option value={item.user_name} key={item.id}>{item.user_name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item label="医嘱分类:">
            <Select
              value={listQuery.say_type}
              style={{ width: 150 }}
              onChange={this.filterCategoryChange}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value={1}>用药医嘱</Select.Option>
              <Select.Option value={2}>非药品治疗医嘱</Select.Option>
              <Select.Option value={3}>保健医嘱</Select.Option>
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
        <Space style={{ marginBottom: 24 }}>
          <Radio.Group value={listQuery.time_type} onChange={this.onChangeTabs}>
            <Radio.Button value="1">临时医嘱</Radio.Button>
            <Radio.Button value="2">长期医嘱</Radio.Button>
          </Radio.Group>
        </Space>
        <Table
          bordered
          rowKey={(record) => record.id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
          size="small"
          scroll={{ y: 230 }}
        >
          <Column title="医嘱时间" dataIndex="create_time" key="create_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="医嘱分类" dataIndex="say_type" key="say_type" align="center"
            render={item => (<span>{item === 1 ? '用药医嘱' : item === 2 ? '非药品治疗医嘱' : '保健医嘱'}</span>)}
          />
          <Column title="医嘱" dataIndex="say" key="say" align="center" />
          <Column title="规格" dataIndex="spec" key="spec" align="center" />
          <Column title="剂量" dataIndex="dose" key="dose" align="center" />
          <Column title="途径" dataIndex="channel" key="channel" align="center" />
          <Column title="频次" dataIndex="frequency" key="frequency" align="center" />
          <Column title="附加说明" dataIndex="explain" key="explain" align="center" />
          <Column title="治疗开始时间" dataIndex="treatment_start_time" key="treatment_start_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD')}
          />
          <Column title="治疗结束时间" dataIndex="treatment_end_time" key="treatment_end_time" align="center"
            render={item => moment(item * 1000).format('YYYY-MM-DD')}
          />
          <Column title="下嘱医生" dataIndex="sign_doctor" key="sign_doctor" align="center" />
          <Column title="是否摆药" dataIndex="is_get_drug" key="is_get_drug" align="center"
            render={item => (<span>{item === 1 ? '是' : item === 2 ? '否' : ''}</span>)}
          />
          <Column title="是否自备" dataIndex="is_own" key="is_own" align="center"
            render={item => (<span>{item === 1 ? '是' : item === 2 ? '否' : ''}</span>)}
          />
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

        {
          listQuery.patient_id
            ? <AddModal
              id={listQuery.patient_id}
              patientList={patientList}
              timeType={listQuery.time_type}
              fetchData={this.fetchData}
            />
            : null
        }

      </div >
    )
  }
}

export default DoctorAdviceList;
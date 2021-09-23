import React, { Component } from "react";
import {
  Table,
  Tag,
  Form,
  Button,
  Input,
  Collapse,
  Pagination,
  message,
  Select,
  DatePicker
} from "antd";
import moment from 'moment';
import EditForm from "./components/editForm";
import AddForm from "./components/addForm";
import ServicePersonSettingComponent from "./components/servicePersonSetting";
import FamilyMembersComponent from "./components/familyMembers";
import { getFamilyList, addFamily, updateFamily } from "@/api/family";
import { getUserList } from "@/api/system";
import "./index.less";
const { Column } = Table;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

class Family extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    serviceDataList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      page: 1,
      size: 10,
      search_name: "",
      doctor_id: "",
      start_time: '',
      end_time: ''
    },

    editModalVisible: false,
    editModalLoading: false,
    editData: {
      id: 0,
      familyName: '',
      familyDes: ''
    },

    addModalVisible: false,
    addModalLoading: false
  };
  fetchData = () => {
    const { listQuery } = this.state;
    this.setState({ loading: true });
    getFamilyList({ ...listQuery }).then((res) => {
      this.setState({ loading: false });
      const tableList = res.data.list;
      const total = res.data.num;
      if (this._isMounted) {
        this.setState({ tableList, total });
      }
    });
  };
  resetData = () => {
    this.setState({
      listQuery: {
        page: 1,
        size: 10,
        search_name: "",
        doctor_id: "",
        start_time: '',
        end_time: ''
      }
    }, () => { this.fetchData(); })
  }
  getServiceDataList = () => {
    getUserList({ page: 1, size: 9999 })
      .then((res) => {
        const serviceDataList = res.data.list;
        if (this._isMounted) {
          this.setState({ serviceDataList });
        }
      });
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
    this.getServiceDataList();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterFamilyNameChange = (e) => {
    let value = e.target.value
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        search_name: value,
      }
    }));
  };
  filterServicePersonChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        doctor_id: value,
      }
    }));
  };
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
  };
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
  };
  // edit start
  handleEdit = (row) => {
    this.setState({
      editData: Object.assign({}, row),
      editModalVisible: true
    });
  };

  handleEditOk = (values) => {
    this.setState({ editModalLoading: true, });
    updateFamily({ ...values }).then(() => {
      message.success("编辑成功!")
      this.setState({ editModalVisible: false });
      this.fetchData();
    }).finally(() => {
      this.setState({ editModalLoading: false });
    });
  };

  handleEditCancel = _ => {
    this.setState({ editModalVisible: false });
  };
  // edit end
  // add start
  handleAdd = () => {
    this.setState({ addModalVisible: true });
  }

  handleAddOk = (values) => {
    this.setState({ addModalLoading: true, });
    addFamily({ ...values }).then(() => {
      message.success("添加成功!");
      this.setState({ addModalVisible: false });
      this.fetchData();
    }).finally(() => {
      this.setState({ addModalLoading: false });
    });
  }

  handleAddCancel = () => {
    this.setState({ addModalVisible: false });
  }
  //add end
  render() {
    const {
      listQuery,
      serviceDataList,
      tableList,
      loading,
      total,
      editModalVisible,
      editData,
      editModalLoading,
      addModalVisible,
      addModalLoading
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
                  onChange={this.filterFamilyNameChange}
                  placeholder="请输入家庭名称或家庭描述搜索"
                />
              </Form.Item>
              <Form.Item label="服务人员:">
                <Select
                  value={listQuery.doctor_id}
                  style={{ width: 120 }}
                  onChange={this.filterServicePersonChange}>
                  <Select.Option value="">全部</Select.Option>
                  {
                    serviceDataList.map((item, index) => item.status === 1 && <Select.Option value={item.doctor_id} key={index}>{item.doctor_name}</Select.Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item label="录入时间:">
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
          rowKey={(record) => record.family_id}
          dataSource={tableList}
          loading={loading}
          pagination={false}
        >
          <Column title="家庭名称" dataIndex="family_name" key="family_name" align="center" width={150}/>
          <Column title="家庭描述" dataIndex="family_describe" key="family_describe" align="center" width={350}/>
          <Column title="家庭成员" dataIndex="member_info" key="member_info" align="center"
            render={(member) => member.length ? member.map((item, index) => <Tag key={index}>{item.member_name}</Tag>) : '-'}
          />
          <Column title="服务医生" dataIndex="doctor_info" key="doctor_info" align="center"
            render={(doctor) => doctor.length ? doctor.map((item, index) => <Tag key={index}>{item.doctor_name}</Tag>) : '-'}
          />
          <Column title="服务护士" dataIndex="nurse_info" key="nurse_info" align="center"
            render={(nurse) => nurse.length ? nurse.map((item, index) => <Tag key={index}>{item.doctor_name}</Tag>) : '-'}
          />
          <Column title="服务助理" dataIndex="assistant_info" key="assistant_info" align="center"
            render={(assistant) => assistant.length ? assistant.map((item, index) => <Tag key={index}>{item.doctor_name}</Tag>) : '-'}
          />
          <Column title="录入时间" dataIndex="create_time" key="create_time" align="center" width={150}
            render={create_time => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
          />
          <Column title="操作" key="action" align="center" render={(text, row) => (
            <span>
              <Button type="link" onClick={this.handleEdit.bind(null, row)}>编辑</Button>
              <FamilyMembersComponent data={row} fetchData={this.fetchData} />
              <ServicePersonSettingComponent data={row} serviceDataList={serviceDataList} fetchData={this.fetchData} />
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
          editModalVisible ?
            <EditForm
              editData={editData}
              visible={editModalVisible}
              confirmLoading={editModalLoading}
              onCancel={this.handleEditCancel}
              onOk={this.handleEditOk}
            /> : null
        }
        <AddForm
          visible={addModalVisible}
          confirmLoading={addModalLoading}
          onCancel={this.handleAddCancel}
          onOk={this.handleAddOk}
        />
      </div>
    );
  }
}

export default Family;

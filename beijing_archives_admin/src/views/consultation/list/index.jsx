import React, { Component } from 'react';
import {
  Table,
  Form,
  Button,
  Pagination,
  DatePicker,
  Select,
  Tooltip,
  Empty
} from "antd";
import { connect } from "react-redux";
import _ from 'underscore';
import moment from 'moment';
import DetailsModal from "./components/detailsModal";
import { setLocalStorage } from "@/utils/auth";
import { getPatientList } from "@/api/patient";
import { getExpertList, getConsultationList } from "@/api/consultation";
import AddModal from './components/addModal';
import "./index.less";
const { Column } = Table;
const { RangePicker } = DatePicker;

class ConsultationList extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    patientList: [],
    expertList: [],
    tableList: [],
    loading: false,
    total: 0,
    listQuery: {
      index: 1,
      page_size: 5,
      expert_id: this.props.location.state ? this.props.location.state.expertId ? this.props.location.state.expertId : '' : '',
      start_time: '',
      end_time: '',
      patient_id: this.props.location.state ? this.props.location.state.patientId ? this.props.location.state.patientId : undefined : undefined
    },
    detailsVisible: false,
    detailsValue: {},

    isHResize: false,
    hNum: 300,
    hNumLimit: 30,
  }

  resizeOffsetInfo = {
    clientTop: 0,
    clientLeft: 0
  }

  leftHeight = 0

  componentDidMount() {
    this.initResizeInfo()
    const throttled = _.throttle(() => {
      this.initResizeInfo()
    }, 200)

    window.onresize = throttled;

    setLocalStorage('consultationAddList', ''); // 初始化添加的数据

    this._isMounted = true;
    this.fetchData();
    this.getExpertData();
    this.getPatientData();
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.onresize = null;
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

  getPatientData = async () => {
    const result = await getPatientList({ index: 1, page_size: 9999, code: '' });
    const patientList = result.data.list;
    this.setState({ patientList });
  }

  resetData = () => {
    this.setState(
      (state) => ({
        listQuery: {
          index: 1,
          page_size: 5,
          expert_id: '',
          start_time: '',
          end_time: '',
          patient_id: ''
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
        start_time: dates ? moment(dates[0]).startOf('day').unix() : '',
        end_time: dates ? moment(dates[1]).endOf('day').unix() : ''
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

  handleDetails = (row) => {
    this.setState({ detailsValue: row, detailsVisible: true });
  }

  /**
  * 初始化resize信息
  */
  initResizeInfo = () => {
    const hEle = document.getElementById('h_resize_container')
    this.resizeOffsetInfo = this.getEleOffset(hEle)
    this.leftHeight = hEle.offsetHeight
  }

  /**
  * 获取元素的偏移信息
  */
  getEleOffset(ele) {
    var clientTop = ele.offsetTop
    var clientLeft = ele.offsetLeft
    let current = ele.offsetParent
    while (current !== null) {
      clientTop += current.offsetTop
      clientLeft += current.offsetLeft
      current = current.offsetParent
    }
    return {
      clientTop,
      clientLeft,
      height: ele.offsetHeight,
      width: ele.offsetWidth
    }
  }

  /**
  * 开始拖动水平调整块
  */
  hResizeDown = () => {
    this.setState({
      isHResize: true
    })
  }

  /**
  * 拖动水平调整块
  */
  hResizeOver = (e) => {
    const { isHResize, hNum, hNumLimit } = this.state
    if (isHResize && hNum >= hNumLimit && (this.resizeOffsetInfo.height - hNum >= hNumLimit)) {
      let newValue = this.resizeOffsetInfo.clientTop + this.resizeOffsetInfo.height - e.clientY - 10
      if (newValue < hNumLimit) {
        newValue = hNumLimit
      }
      if (newValue > this.resizeOffsetInfo.height - hNumLimit) {
        newValue = this.resizeOffsetInfo.height - hNumLimit
      }
      this.setState({
        hNum: newValue
      })
    }
  }

  /**
  * 只要鼠标松开或者离开区域，那么就停止resize
  */
  stopResize = () => {
    this.setState({
      isHResize: false,
    })
  }

  render() {
    const {
      expertList,
      patientList,
      tableList,
      loading,
      total,
      listQuery,
      isHResize,
      hNum,
      detailsVisible,
      detailsValue
    } = this.state;
    const hCursor = isHResize ? 'row-resize' : 'default';
    const hColor = isHResize ? '#ddd' : '#888';
    const { menu } = this.props;
    return (
      <div className="app-container">
        <div className='container' onMouseUp={this.stopResize} onMouseLeave={this.stopResize}>
          <div id='h_resize_container' className='left' onMouseMove={this.hResizeOver}>
            <div style={{ height: `calc(100% - ${hNum + 14}px)`, cursor: hCursor }} className='left-top'>
              {
                isHResize ? <div style={{color: '#ccc'}}>正在拖拽，请您稍等...</div> :
                  <div>
                    <Form layout="inline">
                      <Form.Item label="委托人代号：">
                        <Select
                          showSearch
                          style={{ width: 300 }}
                          placeholder="请选择一个委托人代号"
                          optionFilterProp="children"
                          value={listQuery.patient_id}
                          onChange={this.filterInputChange}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {
                            patientList.map(item => (
                              <Select.Option value={item.id} key={item.id}>{item.code}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item label="发起时间:">
                        <RangePicker
                          value={[listQuery.start_time && moment(listQuery.start_time * 1000), listQuery.end_time && moment(listQuery.end_time * 1000)]}
                          onChange={this.filterDateRangeChange}
                        />
                      </Form.Item>
                      <Form.Item label="下嘱医生:">
                        <Select
                          showSearch
                          value={listQuery.expert_id}
                          style={{ width: 120 }}
                          onChange={this.filterDoctorChange}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
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
                    <div style={{ marginTop: '10px' }}></div>
                    <Table
                      bordered
                      rowKey={(record) => record.id}
                      dataSource={tableList}
                      loading={loading}
                      pagination={false}
                      size="small"
                      scroll={{ x: 1200 }}
                      locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='请选择委托人后进行医嘱查看及添加' /> }}
                    >
                      <Column title="会诊时间" width={160} dataIndex="union_time" key="union_time" align="center"
                        render={item => moment(item * 1000).format('YYYY-MM-DD')}
                      />
                      <Column title="会诊专家" width={200} dataIndex="expert_content" key="expert_content" align="center" />
                      <Column title="机构名称" width={200} dataIndex="organization" key="organization" ellipsis={{ showTitle: false }} align="center"
                        render={item => (<Tooltip placement="topLeft" title={item}> {item} </Tooltip>)}
                      />
                      <Column title="医嘱时间" width={160} dataIndex="create_time" key="create_time" align="center"
                        render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
                      />
                      <Column title="下嘱医生" width={160} dataIndex="sign_expert" key="sign_expert" align="center" />
                      <Column title="备注" width={400} dataIndex="remarks" key="remarks" ellipsis={{ showTitle: false }} align="center"
                        render={item => (<Tooltip placement="topLeft" title={item}> {item} </Tooltip>)}
                      />
                      <Column title="操作" width={100} key="action" align="center" fixed="right"
                        render={(text, row) => (
                          <span>
                            <Button type="link" onClick={() => this.handleDetails(row)}>详情</Button>
                          </span>
                        )}
                      />
                    </Table>
                    <div style={{ marginTop: '5px' }}></div>
                    <Pagination
                      total={total}
                      pageSizeOptions={[5, 10]}
                      pageSize={listQuery.page_size}
                      showTotal={(total) => `共${total}条数据`}
                      onChange={this.changePage}
                      current={listQuery.index}
                      onShowSizeChange={this.changePageSize}
                      showSizeChanger
                      showQuickJumper
                      size="small"
                    />
                  </div>
              }
            </div>
            <div draggable={false} onMouseDown={this.hResizeDown} className='h-resize'>
              <div style={{ backgroundColor: hColor }}></div>
            </div>
            <div style={{ height: hNum, cursor: hCursor }} className='left-bottom' >
              {
                isHResize ? <div style={{color: '#ccc'}}>正在拖拽，请您稍等...</div> :
                  <>
                    {
                      listQuery.patient_id && menu.includes('3-1')
                        ? <AddModal
                          id={listQuery.patient_id}
                          fetchData={this.fetchData}
                          hNum={hNum}
                        />
                        : null
                    }
                  </>
              }
            </div>
          </div>
        </div>
        <DetailsModal
          visible={detailsVisible}
          onCancel={() => this.setState({ detailsVisible: false })}
          detailsValue={detailsValue}
        />
      </div >
    )
  }
}

export default connect((state) => state.user, null)(ConsultationList);
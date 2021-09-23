import React, { Component } from 'react';
import { Button, Modal, Form, Input, Select, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { phoneValidator } from "@/utils/validator";
import { bgps_gps, gps_bgps } from "@/utils";
import { updateFamily } from "@/api/family";
import moment from "moment";
import BMap from "../../../components/BMap";
const { Option } = Select;

class FamilyMember extends Component {
  formRef = React.createRef();
  state = {
    pos: { point: { lng: 116.404, lat: 39.913 } }, //初始化北京坐标
    visible: false,
    addVisible: false,
    editVisible: false,
    memberDataList: this.props.data.member_info,
    family_id: this.props.data.family_id,
    params: {},
    isEidt: false,
    editIndex: 0
  }
  componentDidMount() {
  }
  handleFamilyMember = () => {
    this.setState({ visible: true });
  }
  onCancel = () => {
    this.props.fetchData();
    this.setState({ visible: false });
  }
  openAddMembersModal = () => {
    this.setState({
      addVisible: true,
      params: { member_name: '', sex: 1, birthday: moment(), address: '', coordinate: '' },
      pos: { point: { lng: 116.404, lat: 39.913 } }
    });
  }
  handleAddCancel = () => {
    this.setState({ addVisible: false, isEidt: false });
  }
  handleAddOk = () => {
    this.formRef.current.validateFields()
      .then((values) => {
        let { memberDataList } = this.state;
        let newList = JSON.parse(JSON.stringify(memberDataList));
        values.birthday = moment(values.birthday).unix();
        if (!values.coordinate) {
          values.coordinate = `${bgps_gps(116.404, 39.913).lng},${bgps_gps(116.404, 39.913).lat}`
        }
        if (this.state.isEidt) {
          newList[this.state.editIndex] = values;
        } else {
          newList.push(values);
        }
        updateFamily({ family_id: this.state.family_id, member_info: JSON.stringify(newList) }).then(() => {
          this.setState({
            memberDataList: newList,
            addVisible: false,
            isEidt: false
          })
        });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }
  openEditMemberModal = (item, index) => {
    this.setState({
      addVisible: true,
      isEidt: true,
      editIndex: index,
      params: { ...item, birthday: moment(item.birthday) },
      pos: item.coordinate ?
        { point: { lng: gps_bgps(item.coordinate.split(',')[0], item.coordinate.split(',')[1]).lng, lat: gps_bgps(item.coordinate.split(',')[0], item.coordinate.split(',')[1]).lat } } :
        { point: { lng: 116.404, lat: 39.913 } }
    });

  }
  deleteMember = (item, index) => {
    let { memberDataList } = this.state;
    let newList = JSON.parse(JSON.stringify(memberDataList));
    newList.splice(index, 1);
    updateFamily({ family_id: this.state.family_id, member_info: JSON.stringify(newList) }).then(() => {
      this.setState({
        memberDataList: newList
      })
    });
  }
  handleClickMap = (pos) => {
    this.formRef.current.setFieldsValue({ address: pos.address, coordinate: `${bgps_gps(pos.point.lng, pos.point.lat).lng},${bgps_gps(pos.point.lng, pos.point.lat).lat}` });
  }
  render() {
    const { memberDataList, visible, addVisible, pos, params, isEidt } = this.state;
    return (
      <>
        <Button type="link" onClick={this.handleFamilyMember}>家庭成员</Button>
        {
          visible ?
            <Modal
              title="家庭成员"
              maskClosable={false}
              visible={visible}
              width={800}
              footer={null}
              onCancel={this.onCancel}
            >
              <div className="members-container">

                {
                  memberDataList.map((item, index) => (
                    <div className="members-list" key={index}>
                      <div className="member-list-content">
                        <div className="info">
                          <div>成员名称：{item.member_name}</div>
                          <div>性别：{item.sex === 1 ? '男' : '女'}</div>
                          <div>出生年月：{moment(item.birthday * 1000).format('YYYY-MM-DD')}</div>
                        </div>
                        <div className="phone">
                          <span>电话：</span>{item.mobile}
                        </div>
                        <div className="address">
                          <span>地址：</span>{item.address}
                        </div>
                      </div>
                      <div className="members-list-operator">
                        <EditOutlined className="icon-style" onClick={() => this.openEditMemberModal(item, index)} />
                        <DeleteOutlined className="icon-style" onClick={() => this.deleteMember(item, index)} />
                      </div>
                    </div>
                  ))
                }

                <Button type="link" onClick={this.openAddMembersModal}>添加</Button>
              </div>

            </Modal> : null
        }
        {
          addVisible ?
            <Modal
              title={!isEidt ? '添加成员' : '编辑成员'}
              width={700}
              maskClosable={false}
              visible={addVisible}
              onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
            >
              <Form
                ref={this.formRef}
                layout="inline"
                initialValues={{ ...params, birthday: moment(!isEidt ? params.birthday : params.birthday * 1000) }}
              >
                <Form.Item label="成员名称：" name="member_name" rules={[{ required: true, message: '请输入成员名称!' }]}>
                  <Input placeholder="请输入成员名称" style={{ width: '150px' }} />
                </Form.Item>
                <Form.Item label="性别：" name="sex">
                  <Select>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="出生年月：" name="birthday">
                  <DatePicker allowClear={false} />
                </Form.Item>
                <Form.Item
                  style={{ margin: '10px 0 0 0' }}
                  label="手机号码:"
                  name="mobile"
                  rules={[{ required: true, message: "请输入手机号!" }, {
                    validator: (_, value) =>
                      !value || phoneValidator(value) ? Promise.resolve() : Promise.reject('手机格式错误！'),
                  }]}
                >
                  <Input placeholder="请输入手机号" maxLength={11} />
                </Form.Item>
                <Form.Item label="居住地址：" name="address" style={{ margin: '10px 0 0 11px' }}>
                  <Input placeholder="请输入居住地址" style={{ width: '510px' }} />
                </Form.Item>
                <Form.Item name="coordinate" hidden >
                  <Input />
                </Form.Item>
                <Form.Item label="地图定位：" style={{ margin: '10px 0 0 11px' }}>
                  <BMap value={pos} onChange={this.handleClickMap} style={{ width: '510px' }} onRef={(ref) => { this.$Child = ref }} />
                </Form.Item>
              </Form>
            </Modal> : null
        }

      </>
    )
  }
}

export default FamilyMember;
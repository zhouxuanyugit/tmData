import React, { Component } from 'react';
import { Tree, Typography, Modal, Button, message } from 'antd';
import { EditOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';
import AddEditForm from "./components/addEditForm";
import { getRoleList, addRole, updateRole, deleteRole } from "@/api/system";
import { ROLE_TREE_DATA, SUPER_MENU_DATA } from "@/utils/constants";
const { Text } = Typography;

class Role extends Component {
  state = {
    roleList: [],
    currentIndex: 0, //初始化角色index第一个
    currentId: 0, //初始化角色id第一个
    checkedKeys: [], //初始化角色的内容第一个

    addEditModalVisible: false,
    addEditModalLoading: false,
    addEditData: {},
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    getRoleList({ index: 1, page_size: 9999 }).then((res) => {
      const roleList = res.data.list;
      this.setState({
        roleList,
        checkedKeys: JSON.parse(roleList[0].role_power), //操作后默认选中第一个
        currentIndex: 0,
        currentId: roleList[0].id
      })
    })
  }
  onCheck = (checkedKeys) => {
    const { currentId } = this.state;
    if (
      (
        checkedKeys.includes('0-1')
        || checkedKeys.includes('0-2')
        || checkedKeys.includes('0-3')
      )
      && !checkedKeys.includes('0-0')
    ) {
      checkedKeys.push('0-0');
    }
    if (
      (
        checkedKeys.includes('2-1')
      )
      && !checkedKeys.includes('2-0')
    ) {
      checkedKeys.push('2-0');
    }
    if (
      (
        checkedKeys.includes('3-1')
      )
      && !checkedKeys.includes('3-0')
    ) {
      checkedKeys.push('3-0');
    }
    this.setState({ checkedKeys });
    updateRole({ id: currentId, role_power: JSON.stringify(checkedKeys) }).then(() => {
      getRoleList({ index: 1, page_size: 9999 }).then((res) => {
        const roleList = res.data.list;
        this.setState({ roleList });
      })
    })
  }
  handleClickRoleItem = (item, index) => {
    this.setState({
      currentIndex: index,
      checkedKeys: JSON.parse(item.role_power),
      currentId: item.id
    });
  }
  handleDelete = (item) => {
    Modal.confirm({
      title: <div>你确认要对 <span style={{ color: 'red' }}>{item.role}</span> 角色进行删除？</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const { id } = item;
        deleteRole({ id }).then(() => {
          message.success(`删除成功`);
          this.fetchData();
        })
      }
    });
  }
  handleEdit = (row) => {
    this.setState({
      addEditData: Object.assign({}, row),
      addEditModalVisible: true
    });
  }
  handleAdd = () => {
    this.setState({
      addEditData: { role: '' },
      addEditModalVisible: true
    });
  }
  handleAddEditOk = (values) => {
    this.setState({ addEditModalLoading: true, });
    if (values.id) {
      const { id, role } = values;
      updateRole({ id, role }).then(() => {
        message.success(`编辑成功`);
        this.setState({ addEditModalVisible: false, addEditModalLoading: false });
        this.fetchData();
      })
    } else {
      const { role } = values;
      const role_power = JSON.stringify(SUPER_MENU_DATA); //默认加的角色有全部权限
      addRole({ role, role_power }).then(() => {
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
      roleList,
      currentIndex,
      checkedKeys,
      addEditModalVisible,
      addEditModalLoading,
      addEditData,
    } = this.state;
    return (
      <div className="app-container role-container">
        <div className="role-list">
          <p className="role-head">
            <Text strong>角色</Text>
            <Button
              type="primary"
              size="small"
              onClick={this.handleAdd}
            >
              +添加
            </Button>
          </p>
          <div>
            {
              roleList.map((item, index) => {
                return (
                  <div
                    className={index === currentIndex ? "role-item active" : "role-item"}
                    key={index}
                  >
                    <span className="role-name" onClick={() => this.handleClickRoleItem(item, index)}>{item.role}</span>
                    <span className="operate">
                      <EditOutlined style={{ marginRight: '10px' }} onClick={() => this.handleEdit(item)} />
                      <CloseCircleOutlined onClick={() => this.handleDelete(item)} />
                    </span>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="tree-list">
          <p><Text strong>权限</Text></p>
          <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
            treeData={ROLE_TREE_DATA}
          />
        </div>
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

export default Role;
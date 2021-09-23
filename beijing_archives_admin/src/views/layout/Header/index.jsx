import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Modal, Layout, Avatar, Dropdown, Menu, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { getUserInfo, resetUser, emptyTaglist } from "@/store/actions";
import { removeToken, getToken } from "@/utils/auth";
import { modifyPassword } from "@/api/system";
import AccountFrom from "./components/passwordFrom";
import Sider from "../Sider";
import "./index.less";
const { Header } = Layout;

const LayoutHeader = ({
  name,
  getUserInfo,
  resetUser,
  emptyTaglist,
  history
}) => {
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordModalLoading, setPasswordModalLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    token && getUserInfo(token);
  }, [getUserInfo])

  const handleLogout = () => {
    Modal.confirm({
      title: "退出",
      content: "确定要退出系统吗?",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        resetUser(); // 清除 store里面的用户信息
        removeToken(); // 清楚 cookie 里面的token
        emptyTaglist();
        history.push('/login');
      },
    });
  };

  const handleModifyPassword = () => {
    setPasswordModalVisible(true);
  }

  const handlePasswordCancel = () => {
    setPasswordModalVisible(false);
  }

  const handlePasswordOk = async (values) => {
    console.log(values);
    const { old_pass_word, pass_word } = values;
    setPasswordModalLoading(true);
    try {
      await modifyPassword({ old_pass_word, new_pass_word: pass_word });
      setPasswordModalVisible(false);
      message.success('修改成功，请重新登录！');
      resetUser(); // 清除 store里面的用户信息
      removeToken(); // 清楚 cookie 里面的token
      emptyTaglist();
      history.push('/login');
    } catch (error) {

    } finally {
      setPasswordModalLoading(false);
    }
  }

  const onClick = ({ key }) => {
    switch (key) {
      case "logout":
        handleLogout();
        break;
      case "modify":
        handleModifyPassword();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="modify">
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header />
      <Header
        className="fix-header"
      >
        <Sider />
        <div className="right-menu">
          <div className="dropdown-wrap">
            <Dropdown overlay={menu}>
              <div>
                <Avatar style={{ marginRight: '10px' }} icon={<UserOutlined />} />
                <span style={{ color: '#fff' }}>{name}</span>
              </div>
            </Dropdown>
          </div>
        </div>

        {
          passwordModalVisible ?
            <AccountFrom
              visible={passwordModalVisible}
              confirmLoading={passwordModalLoading}
              onCancel={handlePasswordCancel}
              onOk={handlePasswordOk}
            /> : null
        }
      </Header>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.user,
  };
};
export default connect(mapStateToProps, { getUserInfo, resetUser, emptyTaglist })(withRouter(LayoutHeader));

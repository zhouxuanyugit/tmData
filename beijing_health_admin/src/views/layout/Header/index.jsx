import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Modal, Layout, Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { getUserInfo, resetUser } from "@/store/actions";
import { removeToken, getToken } from "@/utils/auth";
import Hamburger from "@/components/Hamburger";
import BreadCrumb from "@/components/BreadCrumb";
import "./index.less";
const { Header } = Layout;

const LayoutHeader = ({
  name,
  sidebarCollapsed,
  getUserInfo,
  resetUser,
  history
}) => {

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
        resetUser();// 清除 store里面的用户信息
        removeToken(); // 清楚 cookie 里面的token
        history.push('/login');
      },
    });
  };
  const computedStyle = () => {
    let styles;
    if (sidebarCollapsed) {
      styles = {
        width: "calc(100% - 80px)",
      };
    } else {
      styles = {
        width: "calc(100% - 200px)",
      };
    }
    return styles;
  };
  return (
    <>
      <Header />
      <Header
        style={computedStyle()}
        className="fix-header"
      >
        <Hamburger />
        <BreadCrumb />
        <div className="right-menu">
          <div>
            <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} />
            <span>{name}</span>
            <Button type="link" onClick={handleLogout}>退出</Button>
          </div>
        </div>
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
export default connect(mapStateToProps, { getUserInfo, resetUser })(withRouter(LayoutHeader));

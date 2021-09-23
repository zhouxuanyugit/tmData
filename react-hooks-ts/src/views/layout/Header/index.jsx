import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Modal, Layout, Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { getUserInfo, resetUser, emptyTaglist } from "@/store/actions";
import { removeToken, getToken } from "@/utils/auth";
import Sider from "../Sider";
import "./index.less";
const { Header } = Layout;

const LayoutHeader = ({
  name,
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
        resetUser(); // 清除 store里面的用户信息
        removeToken(); // 清楚 cookie 里面的token
        emptyTaglist(); 
        history.push('/login');
      },
    });
  };
  return (
    <>
      <Header />
      <Header
        className="fix-header"
      >
        <Sider />
        <div className="right-menu">
          <Avatar style={{ backgroundColor: '#87d068', marginRight: '10px' }} icon={<UserOutlined />} />
          <span style={{ color: '#fff' }}>{name}</span>
          <Button type="link" onClick={handleLogout}>退出</Button>
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

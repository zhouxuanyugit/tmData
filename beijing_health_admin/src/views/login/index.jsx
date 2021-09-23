import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import { connect } from "react-redux";
import { login, getUserInfo } from "@/store/actions";
import md5 from "js-md5";
import "./index.less";


const Login = ({ history, login, menu }) => {
  const [loading, setLoading] = useState(false);
  // 获取用户信息
  // const handleUserInfo = () => {
  //   getUserInfo()
  //     .then((data) => {

  //     })
  //     .catch((error) => {
  //       message.error(error);
  //     });
  // };

  const onFinish = ({ username, password }) => {
    setLoading(true);
    login(username, md5(password))
      .then((data) => {
        // handleUserInfo(); //再通过token获取用户信息，其实在登陆返回数据里面有用户信息
        if(!data.path) { // 用户没有权限，无法登陆
          setLoading(false);
          message.error("账号尚未授权，请联系管理员授权");
          return
        }
        message.success("登录成功");
        history.push(data.path);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="login-container">
      <Form
        className="content"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="title">
          <h2>用户登录</h2>
        </div>
        <Spin spinning={loading} tip="登录中...">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入用户名!',
              },
            ]}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Spin>
      </Form>
    </div>
  );
};

export default connect((state) => state.user, { login, getUserInfo })(Login);

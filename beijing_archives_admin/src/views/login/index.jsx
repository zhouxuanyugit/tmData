import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import { connect } from "react-redux";
import { login, getUserInfo } from "@/store/actions";
import { randomString } from "@/utils";
import { getLocalStorage, setLocalStorage } from "@/utils/auth";
import "./index.less";


const Login = ({ history, login, menu }) => {
  const [loading, setLoading] = useState(false);
  const [authCode, setAuthCode] = useState('');

  /** 设置授权码 */
  useEffect(() => {
    if (getLocalStorage('authCode')) {
      setAuthCode(getLocalStorage('authCode'));
    } else {
      const code = randomString();
      setLocalStorage('authCode', code);
      setAuthCode(code);
    }
  }, [])

  const onFinish = ({ username, password }) => {
    setLoading(true);
    login(username, password)
      .then((data) => {
        message.success("登录成功");
        history.push(data.path);
      })
      .catch((error) => {
        setLoading(false);
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
          <h4>授权码：{authCode}</h4>
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

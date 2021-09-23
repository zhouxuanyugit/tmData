import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "antd";
import { getLocalStorage, removeToken } from "@/utils/auth";
import { resetUser, emptyTaglist } from "@/store/actions";
import moment from 'moment';
import "./index.less";

const Verfy = ({
  history,
  resetUser,
  emptyTaglist,
  name
}) => {
  const [timeString, setTimeString] = useState(moment().format('YYYY.MM.DD HH:mm:ss'));
  const [authCode, setAuthCode] = useState(getLocalStorage('authCode'));
  useEffect(() => {
    let timer = setInterval(() => {
      setTimeString(moment().format('YYYY.MM.DD HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const handleBackHome = () => {
    resetUser(); // 清除 store里面的用户信息
    removeToken(); // 清楚 cookie 里面的token
    emptyTaglist();
    history.push('/login');
  }

  return (
    <div className="verfy">
      <div className="verfy-container">
        <div className="title">
          登录安全校验中，如有疑问请联系管理员
        </div>
        <div className="time-string">
          {timeString}
        </div>
        <div className="code">
          登录授权码：{authCode}
        </div>
        <div>
          登录用户名：{name}
        </div>
        <div className="verfy-btn">
          <Button
            className="btn"
            type="primary"
            onClick={handleBackHome}
          >
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect((state) => ({...state.user}), { resetUser, emptyTaglist })(withRouter(Verfy));


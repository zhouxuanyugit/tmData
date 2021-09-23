import React, { useState, useEffect } from "react";
import { getLocalStorage } from "@/utils/auth";
import bgImg from "@/assets/images/home-bg.png";
import moment from 'moment';
import "./index.less";

const Dashboard = () => {
  const [timeString, setTimeString] = useState(moment().format('YYYY-MM-DD'));
  const [secondString, setSecondString] = useState(moment().format('HH:mm:ss'));
  const authCode = getLocalStorage('authCode');
  useEffect(() => {
    let timer = setInterval(() => {
      setTimeString(moment().format('YYYY-MM-DD'));
      setSecondString(moment().format('HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);
  return (
    <div className="dash-container" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="center-container">
        <div className="code">
          授权码：{authCode}
        </div>
        <div className="title">
          欢迎使用望舒健康客户档案系统
        </div>
        <div className="time-string">
          {timeString}
        </div>
        <div className="second-string">
          {secondString}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import moment from 'moment';
import "./index.less";

const Dashboard = () => {
  const [timeString, setTimeString] = useState(moment().format('YYYY.MM.DD HH:mm:ss'));
  useEffect(() => {
    let timer = setInterval(() => {
      setTimeString(moment().format('YYYY.MM.DD HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);
  return (
    <div className="app-container home-container">
      <div className="title">
        欢迎使用望舒档案系统
      </div>
      <div className="time-string">
        {timeString}
      </div>
    </div>
  );
};

export default Dashboard;

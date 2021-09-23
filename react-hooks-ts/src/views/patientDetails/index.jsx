import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import HealthDocHome from './components/healthDocHome';
import MedicalHome from './components/medicalHome';
import BigStory from './components/bigStory';
import EmergencyPlan from './components/emergencyPlan';
import HealthPlan from './components/healthPlan';
import MedicalRecord from './components/medicalRecord';
import IllnessSum from './components/illnessSum';
import VisitWatch from './components/visitWatch';
import VisitRecord from './components/visitRecord';
import DocReport from './components/docReport';
import "./index.less";

const { SubMenu } = Menu;

const Details = ({ match, location }) => {
  const [key, setKey] = useState(location.state ? location.state.menuIndex : '1');
  const handleClick = e => {
    setKey(e.key);
  };
  return (
    <div className="app-container patient-document-details">
      {/* {match.params.id}{location.state && location.state.menuIndex} */}
      <div className="menu-list">
        <Menu
          onClick={handleClick}
          defaultSelectedKeys={[key]}
          defaultOpenKeys={['2']}
          mode="inline"
        >
          <Menu.Item key="1">
            健康档案首页
          </Menu.Item>
          <SubMenu key="2" title="病案管理">
            <Menu.Item key="20">病案首页</Menu.Item>
            <Menu.Item key="21">大事记</Menu.Item>
            <Menu.Item key="22">急救预案</Menu.Item>
            <Menu.Item key="23">保健计划</Menu.Item>
            <Menu.Item key="24">病历记录</Menu.Item>
            <Menu.Item key="25">病情总结</Menu.Item>
            <Menu.Item key="26">访视观察</Menu.Item>
            <Menu.Item key="27">出诊记录单</Menu.Item>
          </SubMenu>
          <Menu.Item key="3">
            文档报告
          </Menu.Item>
        </Menu>
      </div>

      <div className="menu-content">
        {
          key === '1' ? <HealthDocHome id={match.params.id} /> : null //健康档案首页
        }
        {
          key === '20' ? <MedicalHome id={match.params.id} /> : null //病案首页
        }
        {
          key === '21' ? <BigStory id={match.params.id} /> : null //大记事
        }
        {
          key === '22' ? <EmergencyPlan id={match.params.id} /> : null // 紧急预案
        }
        {
          key === '23' ? <HealthPlan id={match.params.id} /> : null // 保健计划
        }
        {
          key === '24' ? <MedicalRecord id={match.params.id} /> : null // 病历记录
        }
        {
          key === '25' ? <IllnessSum id={match.params.id} /> : null // 病情总结
        }
        {
          key === '26' ? <VisitWatch id={match.params.id} /> : null // 访视观察
        }
        {
          key === '27' ? <VisitRecord id={match.params.id} /> : null // 访视观察
        }
        {
          key === '3' ? <DocReport id={match.params.id} /> : null
        }
      </div>
    </div>
  )
}

export default Details;
import React from "react";
import { connect } from "react-redux";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { toggleSiderBar } from "../../store/actions";
import "./index.less";
interface Props {
  sidebarCollapsed: any,
  toggleSiderBar: any
}
const Hamburger: React.FC<Props> = (props) => {
  const { sidebarCollapsed, toggleSiderBar } = props;
  return (
    <div className="hamburger-container">
      {
        sidebarCollapsed ? <MenuUnfoldOutlined onClick={toggleSiderBar} /> : <MenuFoldOutlined onClick={toggleSiderBar} />
      }
    </div>
  );
};

export default connect((state: any) => state.app, { toggleSiderBar })(Hamburger);

import React from "react";
import { connect } from "react-redux";
import logoImg from "@/assets/images/logo.png";
import logoSmallImg from "@/assets/images/logo_small.png";
import "./index.less";
const Logo = ({ sidebarCollapsed }) => {
  return (
    <div className="sidebar-logo-container">
      <div className="sidebar-logo-container-copy">
        {
          !sidebarCollapsed ? <img src={logoImg} alt="logo" className="logo-img" /> : <img src={logoSmallImg} alt="logo" className="logo-small-img" />
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.app,
  };
};
export default connect(mapStateToProps, null)(Logo);

import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import Logo from "./Logo";
import Menu from "./Menu";

const LayoutSider = () => {
  return (
    <div style={{display: 'flex'}}>
      <Logo />
      <Menu />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.app
  };
};
export default connect(mapStateToProps)(LayoutSider);

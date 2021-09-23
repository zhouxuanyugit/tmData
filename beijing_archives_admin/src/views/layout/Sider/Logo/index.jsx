import React from "react";
import { withRouter } from "react-router-dom";
import logoImg from "@/assets/images/logo.png";
import "./index.less";
const Logo = ({ history }) => {

  const handleClickHome = () => {
    history.push('/dashboard');
  }

  return (
    <div className="sidebar-logo-container">
      <img src={logoImg} alt="logo" className="logo-img" onClick={handleClickHome} />
    </div>
  );
};

export default withRouter(Logo);

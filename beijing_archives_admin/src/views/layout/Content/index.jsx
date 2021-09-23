import React from "react";
import { Redirect, withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Layout } from "antd";
import BreadCrumb from "@/components/BreadCrumb";
import routeList from "@/config/routeMap";
const { Content } = Layout;

const LayoutContent = ({ location, menu }) => {
  return (
    <Content style={{ minHeight: "calc(100% - 100px)", padding: "20px 20px 0 20px", overflow: 'auto' }}>
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          timeout={500}
          classNames="fade"
          exit={false}
        >
          <div>
            {/* <BreadCrumb /> */}
            <Switch location={location}>
              {/* TODO: 权限控制已知bug */}
              <Redirect exact from="/" to="/dashboard" />
              {routeList.map((route) => {
                return (
                  <Route
                    exact
                    component={route.component}
                    key={route.path}
                    path={route.path}
                  />
                );
              })}
              <Redirect to="/error/404" />
            </Switch>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Content>
  );
};

export default connect((state) => state.user)(withRouter(LayoutContent));

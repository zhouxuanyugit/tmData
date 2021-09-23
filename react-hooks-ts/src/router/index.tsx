import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "../store/actions";
import Layout from "../views/layout";
import Login from "../views/login";

interface Props {
  token: string,
  menu: Array<string>,
  getUserInfo: Function
}

const Router = (props: any) => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route
          path="/"
          render={() => {
            if (!props.token) {
              return <Redirect to="/login" />;
            } else {
              if (props.menu.length) {
                return <Layout />;
              } else {
                props.getUserInfo(props.token).then(() => <Layout />);
              }
            }
          }}
        />
      </Switch>
    </HashRouter>
  );
}

export default connect((state: any) => state.user, { getUserInfo })(Router);

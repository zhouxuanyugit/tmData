import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "@/store/actions";
import Layout from "@/views/layout";
import Login from "@/views/login";
const Router = ({ token, menu, getUserInfo }) => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route
          path="/"
          render={() => {
            if (!token) {
              return <Redirect to="/login" />;
            } else {
              if (menu.length) {
                return <Layout />;
              } else {
                getUserInfo(token).then(() => <Layout />);
              }
            }
          }}
        />
      </Switch>
    </HashRouter>
  );
}

export default connect((state) => state.user, { getUserInfo })(Router);

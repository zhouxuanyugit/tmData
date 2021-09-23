import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "@/store/actions";
import Layout from "@/views/layout";
const Router = ({ menu, getUserInfo }) => {
  return (
    <HashRouter>
      <Switch>
        {/* <Route exact path="/login" component={Login} /> */}
        <Route
          path="/"
          render={() => {
            // if (!token) {
            // return <Redirect to="/login" />;
            // } else {
            // if (menu.length) {
              return <Layout />;
            // } else {
              // getUserInfo().then(() => <Layout />);
            // }
            // }
          }}
        />
      </Switch>
    </HashRouter>
  );
}

export default connect((state) => state.user, { getUserInfo })(Router);

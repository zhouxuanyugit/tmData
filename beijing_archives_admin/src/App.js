import React, { Component } from 'react';
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import 'moment/locale/zh-cn';
import zhCN from "antd/lib/locale/zh_CN";
import Router from "./router";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./store";

class App extends Component {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router />
          </PersistGate>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default App;

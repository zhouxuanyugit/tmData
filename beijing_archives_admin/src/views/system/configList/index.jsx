import React, { Component } from "react";
import {
  Input,
  Button,
  message
} from "antd";
import { getConfigInfo, updateConfigInfo } from "@/api/system";
import "./index.less";

class ConfigList extends Component {
  _isMounted = false; // 这个变量是用来标志当前组件是否挂载
  state = {
    whiteValue: ''
  }

  fetchData = async () => {
    const result = await getConfigInfo({ key: 'white.ip' });
    this.setState({ whiteValue: result.data.value });
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChangeWhiteValue = (e) => {
    this.setState({ whiteValue: e.target.value });
  }

  handleSave = async () => {
    const result = await updateConfigInfo({ key: 'white.ip', value: this.state.whiteValue });
    if (result) {
      message.success(`保存成功`);
    }
  }

  render() {
    const {
      whiteValue
    } = this.state;
    return (
      <div className="app-container">
        <Input addonBefore="IP白名单" value={whiteValue} placeholder="请输入IP, 多个IP需要用“, ”隔开" onChange={this.handleChangeWhiteValue} />

        <div className="save">
          <Button type="primary" onClick={this.handleSave} >
            保存
          </Button>
        </div>
      </div>
    )
  }
}

export default ConfigList;
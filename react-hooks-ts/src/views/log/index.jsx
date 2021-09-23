import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Form,
  Button,
  Pagination,
  DatePicker,
  Input,
} from "antd";
import moment from 'moment';
import { getLogList } from "@/api/log";
import "./index.less";
const { Column } = Table;
const { RangePicker } = DatePicker;

const Log = () => {
  const [form] = Form.useForm();
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const listQuery = {
    input: '',
    start_time: 0,
    end_time: 0
  };

  //此处是为了初始化时候请求一次数据
  useEffect(() => {
    pageChange(page, size);
  }, [])

  //点击下面的分页按钮触发的方法
  const pageChange = useCallback(
    (currentPage, currentSize) => {
      const page = currentPage === undefined ? page : currentPage;
      const size = currentSize === undefined ? size : currentSize;
      setPage(page);
      setSize(size);
      fetchData(listQuery, page, size);
    },
    []
  )

  const fetchData = async (listQuery, page, size) => {
    setLoading(true);
    const result = await getLogList({ ...listQuery, index: page, page_size: size });
    if (result) {
      setLoading(false);
      setTableList(result.data.list);
      setTotal(result.data.count);
    }
  }

  const searchData = useCallback(
    (values) => {
      listQuery.input = values && values.input !== undefined ? values.input : '';
      if (values && values.times !== undefined) {
        let start_time = moment(values.times[0]).startOf('day').unix();
        let end_time = moment(values.times[1]).endOf('day').unix();
        listQuery.start_time = start_time;
        listQuery.end_time = end_time;
      } else {
        listQuery.start_time = 0;
        listQuery.end_time = 0;
      }

      setPage(1);
      fetchData(listQuery, 1, size);
    },
    []
  )

  const resetData = useCallback(
    () => {
      form.resetFields();
      listQuery.input = '';
      listQuery.start_time = 0;
      listQuery.end_time = 0;

      setPage(1);
      fetchData(listQuery, 1, 10);
    },
    []
  )

  return (
    <div className="app-container">
      <Form
        layout="inline"
        form={form}
        onFinish={searchData}
      >
        <Form.Item
          label="关键字"
          name="input"
        >
          <Input
            style={{ width: 300 }}
            placeholder="请输入账号，接口名称搜索"
          />
        </Form.Item>
        <Form.Item
          label="发起时间:"
          name="times"
        >
          <RangePicker
            allowClear={false}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={resetData} >
            重置
          </Button>
        </Form.Item>
      </Form>
      <br />
      <Table
        bordered
        rowKey={(record) => record.id}
        dataSource={tableList}
        loading={loading}
        pagination={false}
      >
        <Column title="账号名" dataIndex="account" key="account" align="center" />
        <Column title="角色名称" dataIndex="user_name" key="user_name" align="center" />
        <Column title="登陆IP" dataIndex="ip" key="ip" align="center" />
        <Column title="操作接口" dataIndex="url" key="url" align="center" />
        <Column title="日志时间" dataIndex="log_time" key="log_time" align="center"
          render={item => moment(item * 1000).format('YYYY-MM-DD HH:mm:ss')}
        />
      </Table>
      <br />
      <Pagination
        total={total}
        pageSizeOptions={["10", "20", "40"]}
        showTotal={(total) => `共${total}条数据`}
        onChange={pageChange}
        current={page}
        onShowSizeChange={pageChange}
        showSizeChanger
        showQuickJumper
      />
    </div>
  )
}

export default Log;
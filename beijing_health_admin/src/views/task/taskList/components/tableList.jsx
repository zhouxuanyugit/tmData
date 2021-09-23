import React from 'react';
import {
  Table,
  Button,
  Badge
} from "antd";
import { formartMoney } from "@/utils";
import moment from 'moment';
const { Column } = Table;

const TableList = ({ tableList, loading, handleDetails, handleRejectReason, handlePass, handleReject }) => {
  return (
    <Table
      bordered
      rowKey={(record) => record.task_id}
      dataSource={tableList}
      loading={loading}
      pagination={false}
    >
      <Column title="任务描述" dataIndex="task_describe" key="task_describe" align="center" width={300}/>
      <Column title="任务类型" dataIndex="task_type_name" key="task_type_name" align="center" />
      <Column title="付费信息" dataIndex="task_charge_money" key="task_charge_money" align="center"
        render={(task_charge_money, row) => <span>{formartMoney(task_charge_money)} 元/{row.task_charge_type === 1 ? '次' : '月'}</span>}
      />
      <Column title="家庭" dataIndex="family_name" key="family_name" align="center" />
      <Column title="执行人" dataIndex="execute_doctor_name" key="execute_doctor_name" align="center" />
      <Column title="发起时间" dataIndex="create_time" key="create_time" align="center"
        render={create_time => moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
      />
      <Column title="状态" dataIndex="status" key="status" align="center"
        render={
          (item) => {
            if (item === 1) {
              return <span style={{ color: '#52c41a' }}><Badge status="success" />进行中</span>
            }
            if (item === 4) {
              return <span style={{ color: '#faad14' }}><Badge status="warning" />待审核</span>
            }
            if (item === 5) {
              return <span style={{ color: '#1890ff' }}><Badge status="processing" />审核通过</span>
            }
            if (item === 10) {
              return <span style={{ color: '#ff4d4f' }}><Badge status="error" />已驳回</span>
            }
            if (item === 3) {
              return <span style={{ color: '#d9d9d9' }}><Badge status="default" />已取消</span>
            }
          }
        } />
      <Column title="操作" key="action" align="center" render={(text, row) => (
        <span>
          <Button type="link" onClick={() => handleDetails(row)}>详情</Button>
          {
            row.status === 10 ? <Button type="link" onClick={() => handleRejectReason(row)}>驳回理由</Button> : null
          }
          {
            row.status === 4 ?
              <>
                <Button type="link" onClick={() => handlePass(row)}>审核通过</Button>
                <Button type="link" onClick={() => handleReject(row)}>驳回</Button>
              </> : null
          }
        </span>
      )} />
    </Table>
  );
}

export default TableList;

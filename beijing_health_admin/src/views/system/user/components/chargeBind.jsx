import React, { useState, useEffect } from 'react';
import { Table, Modal, DatePicker } from 'antd';
import { formartMoney } from "@/utils";
import moment from "moment";
const { Column } = Table;
const { RangePicker } = DatePicker;

/**
 * 计算总费用思路
 * currentMonthStart = moment().startof('month').unix();
 * currentMonthEnd = moment().endof('month').unix();
 * 
 * currentMonthStart > end_time || currentMonthEnd < start_time 日期没有覆盖到本月
 * 
 * currentMonthStart > start_time && currentMonthStart < end_time 天数 1-end_time
 * currentMonthEnd < start_time && currentMonthEnd > end_time 天数 start_time-30
 * currentMonthStart < start_time && currentMonthEnd > end_time 天数 start_time - end_time
 * currentMonthStart > start_time && currentMonthEnd < end_time 天数 30
 */

const ChargeBind = ({ visible, onCancel, onOk, chargeBindData, currentMonthDays }) => {
  const [dataSource, setDataSourse] = useState(chargeBindData);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const total = calcTotal(chargeBindData, currentMonthDays);
    setTotal(total);
  }, [chargeBindData, currentMonthDays]);

  const changeTime = (dates, index) => {
    const dataSourseCopy = [...dataSource];
    dataSourseCopy[index].start_time = dates ? moment(dates[0]).unix() : 0;
    dataSourseCopy[index].end_time = dates ? moment(dates[1]).unix() : 0;
    const total = calcTotal(dataSourseCopy, currentMonthDays);
    setDataSourse(dataSourseCopy);
    setTotal(total);
  }

  const calcTotal = (dataSourseCopy, currentMonthDays) => {
    let total = 0
    dataSourseCopy.forEach(item => {
      if (item.start_time && item.end_time) { // 判断是否选择了时间 才计算
        const currentMonthStart = moment().startOf('month').unix();
        const currentMonthEnd = moment().endOf('month').unix();
        const itemStart = item.start_time;
        const itemEnd = item.end_time;
        if (itemStart < currentMonthStart && itemEnd > currentMonthStart && itemEnd < currentMonthEnd) {
          const bindDays = moment(itemEnd * 1000).date() // 本月有效绑定天数
          total += Math.floor((bindDays / currentMonthDays) * item.task_charge_money * 100) / 100;
        }
        if (itemStart > currentMonthStart && itemStart < currentMonthEnd && itemEnd > currentMonthEnd) {
          const bindDays = moment(itemStart * 1000).date() // 本月有效绑定天数
          total += Math.floor(((currentMonthDays - bindDays + 1) / currentMonthDays) * item.task_charge_money * 100) / 100;
        }
        if (itemStart > currentMonthStart && itemEnd < currentMonthEnd) {
          const bindDays_start = moment(itemStart * 1000).date() // 本月有效绑定天数
          const bindDays_end = moment(itemEnd * 1000).date() // 本月有效绑定天数
          total += Math.floor(((bindDays_end - bindDays_start + 1) / currentMonthDays) * item.task_charge_money * 100) / 100;
        }
        if (itemStart < currentMonthStart && itemEnd > currentMonthEnd) {
          total += Math.floor(item.task_charge_money * 100) / 100;
        }
      }
    });

    return total;
  }
  return (
    <Modal
      title="费用绑定"
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        onOk(dataSource);
      }}
      width={900}
    >
      <Table
        bordered
        dataSource={dataSource}
        pagination={false}
        rowKey={(record) => record.task_type_id}
      >
        <Column title="类型名称" dataIndex="task_type_name" key="task_type_name" />
        <Column title="付费模式" dataIndex="task_charge_type" key="task_charge_type"
          render={(item) => <span>{item === 1 ? '按次付费' : '按月付费'}</span>}
        />
        <Column title="付费金额（元）" dataIndex="task_charge_money" key="task_charge_money"
          render={(item) => <span>{formartMoney(item)}</span>}
        />
        <Column
          title="有效期"
          key="action"
          render={(text, record, index) => {
            let defaultValue = (record.start_time && record.end_time) ?
              [moment(record.start_time * 1000), moment(record.end_time * 1000)] : [];
            return (
              <RangePicker
                defaultValue={defaultValue}
                onChange={(dates) => changeTime(dates, index)}
              />
            )
          }}
        />
      </Table>

      <div className="charge-bind-footer">
        <span className="text">本月预计发放：</span>
        <span className="total">{formartMoney(total)}</span>
      </div>
    </Modal>
  );
}

export default ChargeBind;

import React, { useState, useEffect, useContext, useImperativeHandle, useRef, useCallback } from 'react';
import {
  Input,
  Table,
  Button,
  message,
  Modal
} from "antd";
import { connect } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import AddModal from "./addModal";
import { Context } from "../index";
import { getPatientList, addPatient, deletePatient, movePatientList } from "@/api/patient";
const { Search } = Input;

const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const TableList = ({ menu, cRef }) => {
  const [selectedId, setSelectedId] = useState(0); // 选中的ID
  const [listQuery, setListQuery] = useState({ index: 1, page_size: 9999, input: '' });
  const [tableList, setTableList] = useState([]);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalLoading, setAddModalLoading] = useState(false);

  const [tableScrollY, setTableScrollY] = useState(0);

  const [contextMenuItem, setContextMenuItem] = useState(null);

  const { dispatch } = useContext(Context);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      console.log(dragIndex, hoverIndex);
      const dragRow = tableList[dragIndex];
      setTableList(
        update(tableList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );

      movePatientList({
        move_id: tableList[dragIndex].id,
        to_id: tableList[hoverIndex].id
      }).then(() => { message.success('修改成功') })
    },
    [tableList],
  );

  useEffect(() => {
    fetchData();
  }, [listQuery]);

  // 计算table的高度
  useEffect(() => {
    setTableScrollY(containerRef.current.clientHeight - 106);
    document.addEventListener('click', handleOtherClick);

    return () => {
      document.removeEventListener('click', handleOtherClick);
    }
  }, []);

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    fetchDataTemp: async () => {
      const result = await getPatientList(listQuery);
      const tableList = result.data.list;
      setTableList(tableList);
    }
  }));

  /**获取委托人列表 */
  const fetchData = async () => {
    const result = await getPatientList(listQuery);
    const tableList = result.data.list;
    setTableList(tableList);
    if (!tableList.length) {
      dispatch({ type: 'update_id', id: 0, code: '' });
      setSelectedId(0);
    }
  }

  /**搜索委托人名称 */
  const onSearch = (value, event) => {
    const query = { ...listQuery };
    query.input = value;
    setListQuery(query);
    dispatch({ type: 'update_id', id: 0, code: '' });
    setSelectedId(0);
  }

  /**点击每一行委托人事件 */
  const handleOnClickRow = (event, record, index) => {
    setSelectedId(record.id);
    dispatch({ type: 'update_id', id: tableList[index].id, code: tableList[index].code });
  }

  const handleRightMouse = (event, record, index) => {
    event.preventDefault();
    setContextMenuItem(record);
    menuRef.current.style.display = 'block';
    // clientX/Y 获取到的是触发点相对于浏览器可视区域左上角距离
    const clickX = event.clientX;
    const clickY = event.clientY;
    // window.innerWidth/innerHeight 获取的是当前浏览器窗口的视口宽度/高度
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    // 获取自定义菜单的宽度/高度
    const rootW = menuRef.current.offsetWidth;
    const rootH = menuRef.current.offsetHeight;
    // right为true，说明鼠标点击的位置到浏览器的右边界的宽度可以放下菜单。否则，菜单放到左边。
    // bottom为true，说明鼠标点击位置到浏览器的下边界的高度可以放下菜单。否则，菜单放到上边。
    const right = (screenW - clickX) > rootW;
    const left = !right;
    const bottom = (screenH - clickY) > rootH;
    const top = !bottom;
    if (right) {
      menuRef.current.style.left = `${clickX}px`;
    }
    if (left) {
      menuRef.current.style.left = `${clickX - rootW}px`;
    }
    if (bottom) {
      menuRef.current.style.top = `${clickY}px`;
    }
    if (top) {
      menuRef.current.style.top = `${clickY - rootH}px`;
    }
  }

  const handleOtherClick = () => {
    menuRef.current.style.display = 'none';
  }

  const handleDelete = () => {
    Modal.confirm({
      title: <div>你确认要对代号为 <span style={{ color: 'red' }}>{contextMenuItem.code}</span> 的委托人进行删除？</div>,
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const { id } = contextMenuItem;
        deletePatient({ id }).then(() => {
          message.success(`删除成功`);
          if (id === selectedId) {
            dispatch({ type: 'update_id', id: 0, name: '' });
            setSelectedId(0);
          }
          fetchData();
        })
      }
    });
  }

  const handleAdd = () => {
    setAddModalVisible(true);
  }

  const handleAddCancel = () => {
    setAddModalVisible(false);
  }

  /**添加委托人 */
  const handleAddOk = async (values) => {
    values.code = values.code.replace(/\s+/g, "");
    if (!values.code) {
      message.error('代号不能为空！')
      return
    }
    setAddModalLoading(true);
    try {
      const result = await addPatient({ ...values, sex: 3 });
      message.success('添加成功')
      fetchData();
      setAddModalVisible(false);
    } finally {
      setAddModalLoading(false);
    }
  }

  /**渲染每一行active的 */
  const rowClassName = (record, index) => selectedId === record.id ? 'active' : ''

  const columns = [
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '代号',
      dataIndex: 'code',
      key: 'code'
    }
  ];

  return (
    <div style={{ height: '100%' }} ref={containerRef}>
      {/* {chareData.user_id} */}
      <div className="search-bar">
        <Search
          placeholder="请输入编号、代号搜索"
          allowClear
          enterButton="搜索"
          size="small"
          allowClear={false}
          onSearch={onSearch}
        />
      </div>
      <div>
        {
          menu.includes('0-2') ?
            <Button onClick={handleAdd} type="primary" size="small" style={{ marginBottom: 10 }}>
              + 添加委托人
            </Button> : null
        }
        <DndProvider backend={HTML5Backend}>
          <Table
            bordered
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={tableList}
            pagination={false}
            size="small"
            scroll={{ y: tableScrollY }}
            components={components}
            onRow={(record, index) => ({
              onClick: event => { handleOnClickRow(event, record, index) }, // 点击行
              onContextMenu: event => { handleRightMouse(event, record, index) }, // 鼠标右键
              index,
              moveRow,
            })}
            rowClassName={rowClassName}
          />
        </DndProvider>
      </div>

      <AddModal
        visible={addModalVisible}
        confirmLoading={addModalLoading}
        onCancel={handleAddCancel}
        onOk={handleAddOk}
      />

      {
        <div ref={menuRef} className="contextMenu-wrap" style={{ display: 'none' }}>
          <div className="contextMenu-option" onClick={handleDelete}>删除</div>
        </div>
      }
    </div>
  )
}

export default connect((state) => state.user, null)(TableList);
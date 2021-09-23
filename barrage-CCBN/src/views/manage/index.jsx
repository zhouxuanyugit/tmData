import React, { useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  List,
  Badge,
  Empty
} from "antd";
import {
  getPressName,
  getPageInfo,
  getDateList
} from '@/api/system';
import {
  setSessionStorage,
  getSessionStorage
} from '@/utils/auth';
import moment from 'moment';
import './index.less';

const ManageList = () => {
  const [pressName, setPressName] = useState([]);  // 电子报列表
  const [dateList, setDateList] = useState([]);   // 往期列表
  const [selectionList, setSelectionList] = useState([]);  // 内容列表
  const [selectionSelectedId, setSelectionSelectedId] = useState(0);  // 选择内容的ID
  const [pageInfo, setPageInfo] = useState({});  // 选择内容对象

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pressNameRes = await getPressName({});
    setPressName(pressNameRes.data);

    // 初始化 先判断是否session里面有值
    const params = {};
    if (getSessionStorage('press_id')) {
      params.press_id = getSessionStorage('press_id');
    }
    if (getSessionStorage('date') && getSessionStorage('date') !== 'undefined') {
      params.periods = getSessionStorage('date');
    }
    const pageInfoRes = await getPageInfo(params);
    if (pageInfoRes.code === 500) {
      setSelectionList([]);
    } else {
      setSelectionList(pageInfoRes.data.page);
      setPageInfo(pageInfoRes.data.page[0]);
      setSelectionSelectedId(pageInfoRes.data.page[0].id);
    }

    // 防止刷新被初始化
    if (!getSessionStorage('press_id')) {
      setSessionStorage('press_id', pressNameRes.data[0].id);
    }
    if (!getSessionStorage('date')) {
      setSessionStorage('date', pageInfoRes.data.periods);
    }
  }

  // hover到往期的时候获取列表
  const handleOpenDateMenu = async (visible) => {
    if (visible) {
      const pressId = getSessionStorage('press_id');
      const date = getSessionStorage('date');
      const res = await getDateList({
        press_id: pressId,
        month: moment(date).format('YYYY-MM')
      });

      setDateList(res.data);
    }
  }

  // 点击往期列表
  const handleClickDate = async ({ key }) => {

    const pressId = getSessionStorage('press_id');
    const pageInfoRes = await getPageInfo({ press_id: pressId, periods: key });
    if (pageInfoRes.code === 500) {
      setSelectionList([]);
    } else {
      setSelectionList(pageInfoRes.data.page);
      setPageInfo(pageInfoRes.data.page[0]);
      setSelectionSelectedId(pageInfoRes.data.page[0].id);

      setSessionStorage('date', key);
    }

  }

  const dateMenu = (
    <Menu onClick={handleClickDate}>
      {
        dateList.map(item => <Menu.Item key={item.periods}>{item.periods}</Menu.Item>)
      }
    </Menu>
  )

  // 点击电子报列表
  const handleClickPress = async ({ key }) => {

    const pageInfoRes = await getPageInfo({ press_id: parseInt(key) });
    if (pageInfoRes.code === 500) {
      setSelectionList([]);
    } else {
      setSelectionList(pageInfoRes.data.page);
      setPageInfo(pageInfoRes.data.page[0]);
      setSelectionSelectedId(pageInfoRes.data.page[0].id);
    }

    setSessionStorage('press_id', parseInt(key));
    setSessionStorage('date', pageInfoRes.data.periods);

  };

  const pressMenu = (
    <Menu onClick={handleClickPress}>
      {
        pressName.map(item => <Menu.Item key={item.id}>{item.press_name}</Menu.Item>)
      }
    </Menu>
  );

  const handleClickTitle = (item) => {
    setPageInfo(item);
    setSelectionSelectedId(item.id);
  }

  const handleClickNews = (e, url) => {
    e.preventDefault();
    setSessionStorage('url', url);
    window.open(`${window.location.origin}/#/details`);
    // let html = '';
    // getDetails(url, {}).then((res) => {
    //   console.log(res);
    //   html = res;


    //   var win = window.open('demo.html', 'newwindow');
    //   win.document.write(html.replace('</html>', '').replace('</body>', ''));
    //   win.document.write('<script>console.log(123)</script>');
    // })
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            logo
          </div>
          <div className="selection-header">
            <Dropdown overlay={dateMenu} onVisibleChange={handleOpenDateMenu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                往期
              </a>
            </Dropdown>
            <Dropdown overlay={pressMenu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                电子报
              </a>
            </Dropdown>
          </div>
        </div>
      </header>
      {
        !!selectionList.length ?
          <div className="section-container">
            <div className="title-list">
              {
                selectionList.map(item => (
                  <div key={item.id} className={`title-item ${selectionSelectedId === item.id ? 'selected' : ''}`} onClick={() => handleClickTitle(item)}>{item.name}</div>
                ))
              }
            </div>

            <div className="section-content">
              <div className="content-img">
                <img src={pageInfo.all_path} alt="" />
              </div>
              <div className="content-des">
                <List
                  size="small"
                  dataSource={pageInfo.news}
                  renderItem={
                    item => (
                      <List.Item>
                        <Badge status="default" />
                        <a href="" onClick={(e) => handleClickNews(e, item.url)}>{item.title}</a>
                      </List.Item>)
                  }
                />
              </div>
            </div>
          </div> :
          <div className="empty-status">
            <Empty />
          </div>
      }

    </div>
  )
}

export default ManageList;

import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { HomeOutlined, ProfileOutlined, AuditOutlined, PartitionOutlined, CloudServerOutlined, AlertOutlined } from '@ant-design/icons';
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addTag } from "@/store/actions";
import { getMenuItemInMenuListByProperty } from "@/utils";
import menuList from "@/config/menuConfig";
import "./index.less";
const SubMenu = Menu.SubMenu;
const iconList = [<HomeOutlined />, <ProfileOutlined />, <AuditOutlined />, <CloudServerOutlined />, <PartitionOutlined />, <AlertOutlined />];

const Meun = ({ location, menu, addTag }) => {
  const [openKey, setOpenKey] = useState([{ title: "首页", path: "/dashboard", icon: "home", role: ["9-9"] }]);
  // const path = location.pathname.includes('/patient') ? '/patient' : location.pathname; //进入详情页面菜单还是被选中
  const path = location.pathname;
  const handleMenuSelect = ({ key = "/dashboard" }) => {
    const menuItemAll = JSON.parse(JSON.stringify(menuList));
    menuItemAll.unshift(openKey[0]);
    const menuItem = getMenuItemInMenuListByProperty(menuItemAll, "path", key);
    addTag(menuItem);
  };

  useEffect(() => {
    handleMenuSelect(openKey);
  }, []);

  return (
    <div className="sidebar-menu-container">
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={[path]}
        onSelect={handleMenuSelect}
      >
        {
          menuList.map((item, index) => { //遍历菜单
            return (
              <React.Fragment key={index}>
                {
                  item.children && item.children.length ? //有children的才有子菜单
                    <React.Fragment key={index}>
                      {
                        menu.find(ele => item.role.includes(ele)) ? //如果menu里面包含role里面值，则需要展示菜单 主菜单的权限
                          <SubMenu
                            key={item.path}
                            title={
                              <span>
                                {iconList[index]}
                                <span>{item.title}</span>
                              </span>
                            }
                          >
                            {
                              item.children.map((childItem, childIndex) => {
                                return (
                                  <React.Fragment key={childIndex}>
                                    { //子菜单的权限
                                      menu.indexOf(childItem.role[0]) > -1 ?
                                        <Menu.Item key={childItem.path}>
                                          <Link to={childItem.path}>
                                            <span>{childItem.title}</span>
                                          </Link>
                                        </Menu.Item> : null
                                    }
                                  </React.Fragment>
                                )
                              })
                            }
                          </SubMenu> : null
                      }
                    </React.Fragment>
                    :
                    <React.Fragment key={index}>
                      { //没有children 的菜单
                        menu.indexOf(item.role[0]) > -1 ?
                          <Menu.Item key={item.path}>
                            <Link to={item.path}>
                              {iconList[index]}
                              <span>{item.title}</span>
                            </Link>
                          </Menu.Item> : null
                      }
                    </React.Fragment>
                }
              </React.Fragment>
            )
          })
        }
      </Menu>
    </div>
  );
}

export default connect((state) => state.user, { addTag })(withRouter(Meun));

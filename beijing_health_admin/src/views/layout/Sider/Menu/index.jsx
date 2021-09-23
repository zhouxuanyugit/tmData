import React from "react";
import { Menu } from "antd";
import { HomeOutlined, ProfileOutlined, PartitionOutlined, PropertySafetyOutlined } from '@ant-design/icons';
import { Link, withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import menuList from "@/config/menuConfig";
import "./index.less";
const SubMenu = Menu.SubMenu;
const iconList = [<HomeOutlined />, <ProfileOutlined />, <PropertySafetyOutlined />, <PartitionOutlined />];

const Meun = ({ location, menu }) => {
  const path = location.pathname;
  return (
    <div className="sidebar-menu-container">
      <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
        <div>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[path]}
            defaultOpenKeys={['/family', '/task', '/charge', '/system']}
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
      </Scrollbars>
    </div>
  );
}

export default connect((state) => state.user)(withRouter(Meun));

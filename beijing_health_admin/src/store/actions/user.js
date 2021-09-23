import * as types from "../action-types";
import { SUPER_MENU_DATA } from "@/utils/constants";
import { reqUserInfo } from "@/api/user";
import { getPathByMenu } from "@/utils";
import { message } from "antd";

export const getUserInfo = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqUserInfo({ token })
      .then((response) => {
        const { data } = response;
        if (response.code === 200) {
          const userInfo = data;
          if (userInfo.role_type === 100) { //超级账户
            userInfo.menu = SUPER_MENU_DATA;
          } else {                          // 普通用户
            userInfo.menu = data.role_info.power_info || [];
          }
          // console.log(getPathByMenu(userInfo.menu));
          if (!getPathByMenu(userInfo.menu)) { // 用户已经登陆后，超级管理用户又把他所有权限删除了的处理办法
            message.error("账号尚未授权，请联系管理员授权");
            dispatch(setUserToken(null));
          }
          dispatch(setUserInfo(userInfo)); // 给 store里面赋基本信息
          resolve(data);
        } else {
          const msg = response.msg;
          reject(msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const setUserToken = (token) => {
  return {
    type: types.USER_SET_USER_TOKEN,
    token,
  };
};

export const setUserInfo = (userInfo) => {
  return {
    type: types.USER_SET_USER_INFO,
    ...userInfo,
  };
};

export const resetUser = () => {
  return {
    type: types.USER_RESET_USER,
  };
};

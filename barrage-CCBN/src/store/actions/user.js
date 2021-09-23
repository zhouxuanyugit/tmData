import * as types from "../action-types";
import { reqUserInfo } from "@/api/user";

export const getUserInfo = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqUserInfo({})
      .then((response) => {
        const { role } = response.data;
        const powerList = JSON.parse(role[0].power);
        dispatch(setUserInfo({ menu: powerList })); // 给 store里面赋基本信息
        resolve(powerList);
        // if (response.code === 200) {
        //   const userInfo = data;
        //   if (userInfo.role_type === 100) { //超级账户
        //     userInfo.menu = SUPER_MENU_DATA;
        //   } else {                          // 普通用户
        //     userInfo.menu = data.role_info.power_info || [];
        //   }
        //   if (!getPathByMenu(userInfo.menu)) { // 用户已经登陆后，超级管理用户又把他所有权限删除了的处理办法
        //     message.error("账号尚未授权，请联系管理员授权");
        //     dispatch(setUserToken(null));
        //   }
        //   dispatch(setUserInfo(userInfo)); // 给 store里面赋基本信息
        //   resolve(data);
        // } else {
        //   const msg = response.msg;
        //   reject(msg);
        // }
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

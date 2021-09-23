import * as types from "../action-types";
import { SUPER_MENU_DATA } from "../../utils/constants";
import { reqUserInfo } from "../../api/user";

export const getUserInfo = (token: any) => (dispatch: any) => {
  return new Promise((resolve, reject) => {
    reqUserInfo({})
      .then((response: any) => {
        const { data } = response;
        if (response.code === 200) {
          const userInfo = data.user_info;
          if (userInfo.user_type === 2) { //超级账户
            userInfo.menu = SUPER_MENU_DATA;
          } else {
            userInfo.menu = JSON.parse(data.role_info.role_power);
          }
          dispatch(setUserInfo(userInfo)); // 给 store里面赋基本信息
          resolve(data);
        } else {
          const msg = response.msg;
          reject(msg);
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const setUserToken = (token: any) => {
  return {
    type: types.USER_SET_USER_TOKEN,
    token,
  };
};

export const setUserInfo = (userInfo: any) => {
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

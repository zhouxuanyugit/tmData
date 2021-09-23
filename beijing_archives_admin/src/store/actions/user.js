import * as types from "../action-types";
import { SUPER_MENU_DATA } from "@/utils/constants";
import { reqUserInfo } from "@/api/user";

export const getUserInfo = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqUserInfo({})
      .then((response) => {
        const { data } = response;
        if (response.code === 200) {
          const userInfo = data.user_info;
          const domainUrl = data.file_domain;
          if (userInfo.user_type === 2) { //超级账户
            userInfo.menu = SUPER_MENU_DATA;
          } else {
            userInfo.menu = JSON.parse(data.role_info.role_power);
          }
          dispatch(setUserInfo(userInfo)); // 给 store里面赋基本信息
          dispatch(setDomainUrl(domainUrl));
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

export const setDomainUrl = (url) => {
  return {
    type: types.SET_DOMAIN_URL,
    url
  };
};

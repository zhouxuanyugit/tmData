import { setUserToken, setUserInfo } from "./user";
import { reqLogin } from "@/api/login";
import { setToken } from "@/utils/auth";
import { SUPER_MENU_DATA } from "@/utils/constants";
import { getPathByMenu } from "@/utils";
export const login = (username, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqLogin({ mobile: username.trim(), admin_passwd: password, state: 2 })
      .then((response) => {
        const { data } = response;
        if (response.code === 200) {
          const token = data.token;
          const userInfo = data.admin_info;
          if (userInfo.role_type === 100) { //超级账户
            userInfo.menu = SUPER_MENU_DATA;
          } else {
            userInfo.menu = data.admin_info.role_info.power_info;
          }
          dispatch(setUserToken(token)); //给 store里面赋token值
          dispatch(setUserInfo(userInfo)); // 给 store里面赋基本信息
          setToken(token); //给cookie里面赋token值
          resolve({path: userInfo.menu && getPathByMenu(userInfo.menu)});
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

export const logout = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    //   reqLogout(token)
    //     .then((response) => {
    //       const { data } = response;
    //       if (data.status === 0) {
    //         dispatch(resetUser());
    //         removeToken();
    //         resolve(data);
    //       } else {
    //         const msg = data.message;
    //         reject(msg);
    //       }
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
  });
};

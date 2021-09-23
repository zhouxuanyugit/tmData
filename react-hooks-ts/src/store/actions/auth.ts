import { setUserToken, setUserInfo } from "./user";
import { reqLogin } from "../../api/login";
import { setToken } from "../../utils/auth";
import { SUPER_MENU_DATA } from "../../utils/constants";
export const login = (username: any, password: any) => (dispatch: any) => {
  return new Promise((resolve, reject) => {
    reqLogin({ account: username.trim(), pass_word: password })
      .then((response: any) => {
        const { data } = response;
        if (response.code === 200) {
          const token = data.token;
          const userInfo = data.user_info;
          if (userInfo.user_type === 2) { //超级账户
            userInfo.menu = SUPER_MENU_DATA;
          } else {
            userInfo.menu = JSON.parse(data.role_info.role_power);
          }
          dispatch(setUserToken(token)); //给 store里面赋token值
          dispatch(setUserInfo(userInfo)); // 给 store里面赋基本信息
          setToken(token); //给cookie里面赋token值
          resolve({path: '/dashboard'});
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

export const logout = (token: any) => (dispatch: any) => {
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

import axios from "axios";
import { store } from "@/store";
import { message } from "antd";
import { getToken, removeToken, getLocalStorage } from "@/utils/auth";
import { resetUser } from "@/store/actions";
import { HOSTPRO } from "./constants";
import { encryption, decryption } from "./secret";

//创建一个axios示例
const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.headers.authcode = getLocalStorage('authCode');
    if (store.getState().user.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers.token = getToken();
    }
    if (config.data && HOSTPRO) { // 线上需要开启接口加密
      config.data = { data: encryption(config.data) };
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  // (response) => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // MSG_OK = 200  //普遍的正常
    // MSG_ERR = 500  //普通的失败
    // MSG_USER_ERR = 600 //用户登录信息错误的失败，如验证登录信息失败，登录验证过期
    // MSG_LIMIT_ERR = 601 //用户登录失败次数过多
    // MSG_AUTO_ERR = 602 //授权码正在申请中
    // MSG_AUTO_ERR1 = 603 //授权码被禁用
    // MSG_AUTO_ERR2 = 604 //授权码错误
    // MSG_AES_ERR = 700 //解密失败
    const res = response.data;
    if (res.code === 500 || res.code === 601 || res.code === 604) {
      message.error(res.msg);
      return Promise.reject('error');
    } else if (res.code === 602 || res.code === 603) {
      message.error(res.msg);
      window.location.href = `${window.location.origin}/#/verfy`;
      return Promise.reject('error');
    } else if (res.code === 600) {
      store.dispatch(resetUser());// 清除 store里面的用户信息
      removeToken(); // 清楚 cookie 里面的token
      message.error("token 失效，请重新登陆!");
      return Promise.reject('error');
    } else {
      res.data = HOSTPRO ? decryption(res.data) : res.data; // 线上需要开启接口解密
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;

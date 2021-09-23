import * as types from "../action-types";
import { getToken } from "@/utils/auth";
const initUserInfo = {
  id: "", //登陆人的id 上传附件用
  name: "", //登陆人的name 在右上角显示用
  role: "",
  avatar:"",
  token: getToken(), //登陆人的token 请求接口用
  menu: []
};
export default function user(state = initUserInfo, action) {
  switch (action.type) {
    case types.USER_SET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case types.USER_SET_USER_INFO:
      return {
        ...state,
        id: action.admin_id,
        name: action.admin_name,
        role: action.role,
        avatar: action.admin_pic,
        menu: action.menu
      };
    case types.USER_RESET_USER:
      return {};
    default:
      return state;
  }
}

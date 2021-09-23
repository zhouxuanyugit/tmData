import * as types from "../action-types";
import { getToken } from "../../utils/auth";
const initUserInfo = {
  name: "", //登陆人的name 在右上角显示用
  role: "",
  avatar:"",
  token: getToken(), //登陆人的token 请求接口用
  menu: []
};
export default function user(state = initUserInfo, action: any) {
  switch (action.type) {
    case types.USER_SET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case types.USER_SET_USER_INFO:
      return {
        ...state,
        name: action.user_name,
        role: action.role_id,
        // avatar: action.admin_pic,
        menu: action.menu
      };
    case types.USER_RESET_USER:
      return {};
    default:
      return state;
  }
}

import { login, logout } from "./auth";
import { getUserInfo, setUserToken, setUserInfo, resetUser } from "./user";
import { toggleSiderBar } from "./app";
import { addTag, emptyTaglist, deleteTag, closeOtherTags } from "./tagsView";

export {
  login,
  logout,
  getUserInfo,
  setUserToken,
  setUserInfo,
  resetUser,
  toggleSiderBar,
  addTag,
  emptyTaglist,
  deleteTag,
  closeOtherTags
};

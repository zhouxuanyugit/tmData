import * as types from "../action-types";
const initState = {
  taglist: [],
};
export default function app(state = initState, action: any) {
  switch (action.type) {
    case types.TAGSVIEW_ADD_TAG:
      const tag = action.tag;
      if (state.taglist.some((item: any) => item.path === tag.path)) { //判断传过来得路由path是否相同，相同则返回原来得路由列表，否则加入新路由到路由列表
        return state;
      } else {
        return {
          ...state,
          taglist: [...state.taglist, tag],
        };
      }
    case types.TAGSVIEW_DELETE_TAG:
      return {
        ...state,
        taglist: [...state.taglist.filter((item) => item !== action.tag)],
      };
    case types.TAGSVIEW_EMPTY_TAGLIST:
      return {
        ...state,
        taglist: [
          ...state.taglist.filter((item: any) => item.path === "/dashboard"),
        ],
      };
    case types.TAGSVIEW_CLOSE_OTHER_TAGS:
      return {
        ...state,
        taglist: [
          ...state.taglist.filter((item: any) => item.path === "/dashboard" || item === action.tag),
        ],
      };
    default:
      return state;
  }
}

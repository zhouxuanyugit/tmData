import * as types from "../action-types";
const initState = {
  sidebarCollapsed: false
};
export default function app(state = initState, action: any) {
  switch (action.type) {
    case types.APP_TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    default:
      return state;
  }
}

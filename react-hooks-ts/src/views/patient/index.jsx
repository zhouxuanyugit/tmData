import React, { createContext, useReducer } from "react";
import TableList from "./components/tableList";
import DetailsInfo from "./components/detailsInfo";
import "./index.less";

export const Context = createContext({});
const reducer = (state, action) => {
  switch (action.type) {
    case 'update_id':
      return { ...state, id: action.id, code: action.code };
    default:
      return state;
  }
}

const Patient = () => {
  const [chareData, dispatch] = useReducer(reducer, { id: 0, code: '' });
  return (
    <Context.Provider value={{chareData, dispatch}}>
      <div className="app-container patient-document">
        <div className="table-list">
          <TableList />
        </div>
        <div className="details-info">
          <DetailsInfo />
        </div>
      </div>
    </Context.Provider>
  )
}

export default Patient;

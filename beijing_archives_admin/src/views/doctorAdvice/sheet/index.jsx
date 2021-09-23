import React, { createContext, useReducer } from "react";
import TableList from "./components/tableList";
import DetailsInfo from "./components/detailsInfo";
import "./index.less";

export const Context = createContext({});
const reducer = (state, action) => {
  switch (action.type) {
    case 'update_id':
      return { ...state, id: action.id, code: action.code, sex: action.sex };
    default:
      return state;
  }
}

const DoctorAdviceSheet = () => {
  const [chareData, dispatch] = useReducer(reducer, { id: 0, code: '', sex: 0 });
  return (
    <Context.Provider value={{ chareData, dispatch }}>
      <div className="app-container doctor-advice-sheet">
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

export default DoctorAdviceSheet;
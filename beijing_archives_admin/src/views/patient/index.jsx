import React, { createContext, useReducer, useRef } from "react";
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
  const childRef = useRef();
  const updateTable = () => {
    childRef.current.fetchDataTemp();
  }
  return (
    <Context.Provider value={{chareData, dispatch}}>
      <div className="app-container patient-document">
        <div className="table-list">
          <TableList cRef={childRef}/>
        </div>
        <div className="details-info">
          <DetailsInfo updateTable={updateTable}/>
        </div>
      </div>
    </Context.Provider>
  )
}

export default Patient;

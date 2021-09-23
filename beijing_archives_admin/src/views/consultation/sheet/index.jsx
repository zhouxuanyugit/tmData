import React, { createContext, useReducer, useRef } from "react";
import TableList from "./components/tableList";
import DetailsInfo from "./components/detailsInfo";
import "./index.less";

export const Context = createContext({});
const reducer = (state, action) => {
  switch (action.type) {
    case 'update_id':
      return { ...state, id: action.id, name: action.name };
    default:
      return state;
  }
}

const ConsultationSheet = () => {
  const [chareData, dispatch] = useReducer(reducer, { id: 0, name: '' });
  const childRef = useRef();
  const updateTable = () => {
    childRef.current.fetchDataTemp();
  }
  return (
    <Context.Provider value={{ chareData, dispatch }}>
      <div className="app-container consultation-sheet">
        <div className="table-list">
          <TableList cRef={childRef} />
        </div>
        <div className="details-info">
          <DetailsInfo updateTable={updateTable} />
        </div>
      </div>
    </Context.Provider>
  )
}

export default ConsultationSheet;
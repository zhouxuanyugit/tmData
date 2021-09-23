import React from 'react';
import Template from "./templateMiddle";
import {
  getIllnessSumList,
  addIllnessSumPlan,
  getIllnessSumInfo,
  updateIllnessSumInfo,
  deleteIllnessSumInfo
} from "@/api/patientDetails";

/** 病情总结 */
const IllnessSum = ({ id }) => {
  return (
    <>
      <Template
        title="病情总结"
        getList={getIllnessSumList}
        addInfo={addIllnessSumPlan}
        getInfo={getIllnessSumInfo}
        updateInfo={updateIllnessSumInfo}
        deleteInfo={deleteIllnessSumInfo}
        id={id}
      />
    </>
  )
}

export default IllnessSum;
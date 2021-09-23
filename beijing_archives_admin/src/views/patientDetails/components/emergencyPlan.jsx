import React from 'react';
import Template from "./templateMiddle";
import {
  getEmergencyPlanList,
  addEmergencyPlan,
  getEmergencyInfo,
  updateEmergencyInfo,
  deleteEmergencyInfo
} from "@/api/patientDetails";

/** 急救预案 */
const EmergencyPlan = ({ id }) => {
  return (
    <>
      <Template
        title="急救预案"
        getList={getEmergencyPlanList}
        addInfo={addEmergencyPlan}
        getInfo={getEmergencyInfo}
        updateInfo={updateEmergencyInfo}
        deleteInfo={deleteEmergencyInfo}
        id={id}
      />
    </>
  )
}

export default EmergencyPlan;
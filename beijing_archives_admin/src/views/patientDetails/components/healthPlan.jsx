import React from 'react';
import Template from "./templateMiddle";
import {
  getHealthPlanList,
  addHealthPlanPlan,
  getHealthPlanInfo,
  updateHealthPlanInfo,
  deleteHealthPlanInfo
} from "@/api/patientDetails";

/** 保健计划 */
const HealthPlan = ({ id }) => {
  return (
    <>
      <Template
        title="保健计划"
        getList={getHealthPlanList}
        addInfo={addHealthPlanPlan}
        getInfo={getHealthPlanInfo}
        updateInfo={updateHealthPlanInfo}
        deleteInfo={deleteHealthPlanInfo}
        id={id}
      />
    </>
  )
}

export default HealthPlan;
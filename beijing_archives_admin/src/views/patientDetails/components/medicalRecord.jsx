import React from 'react';
import Template from "./templateMiddle";
import {
  getMedicalRecordList,
  addMedicalRecordPlan,
  getMedicalRecordInfo,
  updateMedicalRecordInfo,
  deleteMedicalRecordInfo
} from "@/api/patientDetails";

/** 病历记录 */
const MedicalRecord = ({ id }) => {
  return (
    <>
      <Template
        title="病历记录"
        getList={getMedicalRecordList}
        addInfo={addMedicalRecordPlan}
        getInfo={getMedicalRecordInfo}
        updateInfo={updateMedicalRecordInfo}
        deleteInfo={deleteMedicalRecordInfo}
        id={id}
      />
    </>
  )
}

export default MedicalRecord;
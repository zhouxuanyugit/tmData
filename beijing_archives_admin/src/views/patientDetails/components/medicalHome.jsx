import React from 'react';
import TemplateFront from "./templateFront";
import { getMedicalHomeInfo, updateMedicalHomeInfo } from "@/api/patientDetails";

const RENDERLIST = ['过敏史', '传染病史', '家族史', '长期居住地', '生活习惯或嗜好', '婚姻史', '主要诊断'];
const RENDERLISTFIELD = ['allergy_history', 'contagion_history', 'family_history', 'long_house', 'life', 'marry_history', 'main_diagnosis'];

const anchorIds = Array.from({ length: RENDERLIST.length }, (v, k) => `catelog${k + 1}`) // 生成锚点id的列表
const renderListFieldData = { allergy_history: '', contagion_history: '', family_history: '', long_house: '', life: '', marry_history: '', main_diagnosis: '', hospital1: '', hospital2: '', hospital3: '' }

/** 病案首页 */
const MedicalHome = ({ id }) => {
  return (
    <>
      <TemplateFront
        getInfo={getMedicalHomeInfo}
        updateInfo={updateMedicalHomeInfo}
        renderList={RENDERLIST}
        renderListField={RENDERLISTFIELD}
        renderListFieldDataDefult={renderListFieldData}
        anchorIds={anchorIds}
        id={id}
      />
    </>
  )
}

export default MedicalHome;
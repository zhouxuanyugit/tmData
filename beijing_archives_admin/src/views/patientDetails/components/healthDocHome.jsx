import React from 'react';
import TemplateFront from "./templateFront";
import { getHealthDocInfo, updateHealthDocInfo } from "@/api/patientDetails";

const RENDERLIST = ['大事记相关内容', '诊断', '目前用药', '会诊情况', '检查情况', '住院情况', '疫苗注射情况'];
const RENDERLISTFIELD = ['big_events', 'diagnosis', 'now_drug', 'union_diagnosis', 'check', 'hospitalization', 'vaccines_use'];

const anchorIds = Array.from({ length: RENDERLIST.length }, (v, k) => `catelog${k + 1}`) // 生成锚点id的列表
const renderListFieldData = { big_events: '', diagnosis: '', now_drug: '', union_diagnosis: '', check: '', hospitalization: '', vaccines_use: '', hospital1: '', hospital2: '', hospital3: '' }

/** 健康档案首页 */
const HealthDocHome = ({ id }) => {
  return (
    <>
      <TemplateFront
        getInfo={getHealthDocInfo}
        updateInfo={updateHealthDocInfo}
        renderList={RENDERLIST}
        renderListField={RENDERLISTFIELD}
        renderListFieldDataDefult={renderListFieldData}
        anchorIds={anchorIds}
        id={id}
      />
    </>
  )
}

export default HealthDocHome;
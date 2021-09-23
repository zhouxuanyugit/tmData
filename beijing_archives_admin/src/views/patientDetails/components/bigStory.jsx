import React from 'react';
import TemplateFront from "./templateFront";
import { getBigStoryInfo, updateBigStoryInfo } from "@/api/patientDetails";

const RENDERLIST = ['既往史', '手术史及输血史', '婚姻及家族史', '目前主要疾病及确诊时间', '疾病主要诊断', '目前用药情况', '过敏史', '主要疾病诊疗经过',
  '心血管（循环）系统', '呼吸系统', '消化系统', '神经系统', '内分泌系统', '免疫系统', '血液系统', '运动系统', '泌尿生殖系统', '皮肤科', '耳鼻喉科', '口腔科',
  '眼科', '普外科', '骨科', '中医科', '其他'];
const RENDERLISTFIELD = ['history', 'operation_history', 'family_history', 'now_illness', 'illness_main_diagnosis', 'now_drug', 'allergy_history', 'now_illness_treatment',
  'cardiovascular', 'breathing', 'digestion', 'nerve', 'endocrine', 'immune', 'big_blood', 'motion', 'genitourinary', 'skin', 'otorhinolaryngology', 'mouth',
  'eye', 'general_surgery', 'bone', 'chinese_medicine', 'other'];

const anchorIds = Array.from({ length: RENDERLIST.length }, (v, k) => `catelog${k + 1}`) // 生成锚点id的列表
const renderListFieldData = {
  history: '', operation_history: '', family_history: '', now_illness: '', illness_main_diagnosis: '', now_drug: '', allergy_history: '',
  now_illness_treatment: '', cardiovascular: '', breathing: '', digestion: '', nerve: '', endocrine: '', immune: '', big_blood: '', motion: '', genitourinary: '',
  skin: '', otorhinolaryngology: '', mouth: '', eye: '', general_surgery: '', bone: '', chinese_medicine: '', other: '',
  hospital1: '', hospital2: '', hospital3: ''
}

/** 大记事 */
const BigStory = ({ id }) => {
  return (
    <>
      <TemplateFront
        getInfo={getBigStoryInfo}
        updateInfo={updateBigStoryInfo}
        renderList={RENDERLIST}
        renderListField={RENDERLISTFIELD}
        renderListFieldDataDefult={renderListFieldData}
        anchorIds={anchorIds}
        id={id}
      />
    </>
  )
}

export default BigStory;
const ROLE_TREE_DATA = [
  { title: '首页', key: '9-9', disableCheckbox: true },
  { title: "患者档案", key: "0", children: [{ title: "查看患者信息", key: "0-0" }, { title: "编辑患者信息", key: "0-1" }, { title: "添加患者", key: "0-2" }, { title: "删除患者", key: "0-3" }] },
  { title: "患者病历详情", key: "1", children: [{ title: "健康档案", key: "1-0" }, { title: "病案首页", key: "1-1" }, { title: "大事记", key: "1-2" }, { title: "急救预案", key: "1-3" }, { title: "保健计划", key: "1-4" }, { title: "病历记录", key: "1-5" }, { title: "病情总结", key: "1-6" }, { title: "访视观察", key: "1-7" }, { title: "出诊记录单", key: "1-8" }, { title: "文档报告", key: "1-9" }] },
  { title: "医嘱管理", key: "2", children: [{ title: "医嘱查看", key: "2-0" }, { title: "新增医嘱", key: "2-1" }, { title: "医嘱单", key: "2-2" }] },
  { title: "会诊管理", key: "3", children: [{ title: "会诊查看", key: "3-0" }, { title: "新增会诊", key: "3-1" }, { title: "会诊专家管理", key: "3-2" }] },
  { title: "其他", key: "4", children: [{ title: "角色管理", key: "4-0" }, { title: "用户管理", key: "4-1" }, { title: "授权码管理", key: "4-3" }, { title: "日志", key: "4-2" }] },
];
const SUPER_MENU_DATA = [
  "9-9",
  "0-0", "0-1", "0-2", "0-3",
  "1-0", "1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8", "1-9",
  "2-0", "2-1", "2-2",
  "3-0", "3-1", "3-2",
  "4-0", "4-1", "4-3", "4-2"
];

export {
  ROLE_TREE_DATA,
  SUPER_MENU_DATA
}
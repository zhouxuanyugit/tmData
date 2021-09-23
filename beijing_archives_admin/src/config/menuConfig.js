const menuList = [
  {
    title: "委托人档案",
    path: "/patient",
    role: ['0-0']
  },
  {
    title: "医嘱管理",
    path: "/doctorAdvice",
    role: ['2-0', '2-2'],
    children: [
      {
        title: "用药医嘱",
        path: "/doctorAdvice/list/1",
        role: ['2-0']
      },
      {
        title: "非药物治疗医嘱",
        path: "/doctorAdvice/list/2",
        role: ['2-0']
      },
      {
        title: "保健医嘱",
        path: "/doctorAdvice/list/3",
        role: ['2-0']
      },
      {
        title: "医嘱单",
        path: "/doctorAdvice/sheet",
        role: ['2-2']
      }
    ],
  },
  {
    title: "会诊管理",
    path: "/consultation",
    role: ['3-0', '3-2'],
    children: [
      {
        title: "会诊记录",
        path: "/consultation/list",
        role: ['3-0']
      },
      {
        title: "会诊专家管理",
        path: "/consultation/sheet",
        role: ['3-2']
      },
    ],
  },
  {
    title: "系统管理",
    path: "/system",
    role: ['4-0', '4-1', '4-3'],
    children: [
      {
        title: "角色管理",
        path: "/system/role",
        role: ['4-0']
      },
      {
        title: "用户管理",
        path: "/system/user",
        role: ['4-1']
      },
      {
        title: "授权码管理",
        path: "/system/authCode",
        role: ['4-3']
      }
    ],
  },
  {
    title: "日志",
    path: "/log",
    role: ["4-2"]
  }
];
export default menuList;

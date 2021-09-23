const menuList = [
  {
    title: "家庭管理",
    path: "/family",
    role: ['0-0'],
    children: [
      {
        title: "家庭列表管理",
        path: "/family/index",
        role: ['0-0']
      }
    ],
  },
  {
    title: "任务管理",
    path: "/task",
    role: ['0-1', '0-2'],
    children: [
      {
        title: "任务类型配置",
        path: "/task/type",
        role: ['0-1']
      },
      {
        title: "任务列表管理",
        path: "/task/list",
        role: ['0-2']
      }
    ],
  },
  {
    title: "费用管理",
    path: "/charge",
    role: ['0-3', '0-4', '0-5', '0-6'],
    children: [
      {
        title: "费用类别配置",
        path: "/charge/type",
        role: ['0-3']
      },
      {
        title: "报销管理",
        path: "/charge/reimburse",
        role: ['0-4']
      },
      {
        title: "付费管理",
        path: "/charge/pay",
        role: ['0-5']
      },
      {
        title: "提现管理",
        path: "/charge/cashout",
        role: ['0-6']
      }
    ],
  },
  {
    title: "系统配置",
    path: "/system",
    role: ['0-7', '0-8', '0-9'],
    children: [
      {
        title: "角色管理",
        path: "/system/role",
        role: ['0-7']
      },
      {
        title: "用户管理",
        path: "/system/user",
        role: ['0-8']
      },
      {
        title: "外部成员管理",
        path: "/system/externalUser",
        role: ['0-9']
      }
    ],
  }
];
export default menuList;

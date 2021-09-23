const menuList = [
  {
    title: "系统设置",
    path: "/system",
    role: ['0-0', '0-1', '0-2', '0-3', '0-4'],
    children: [
      {
        title: "角色设置",
        path: "/system/role",
        role: ['0-0']
      },
      {
        title: "公司设置",
        path: "/system/company",
        role: ['0-1']
      },
      {
        title: "团队设置",
        path: "/system/team",
        role: ['0-2']
      },
      {
        title: "岗位设置",
        path: "/system/position",
        role: ['0-3']
      },
      {
        title: "人员设置",
        path: "/system/user",
        role: ['0-4']
      }
    ],
  },
  {
    title: "公司管理",
    path: "/company",
    role: ['1-0'],
    children: [
      {
        title: "项目管理",
        path: "/company/project",
        role: ['1-0']
      }
    ],
  },
  {
    title: "订单审核",
    path: "/order",
    role: ['2']
  },
  {
    title: "团队管理",
    path: "/team",
    role: ['3-0', '3-1', '3-2'],
    children: [
      {
        title: "订单管理",
        path: "/team/order",
        role: ['3-0']
      },
      {
        title: "模块管理",
        path: "/team/module",
        role: ['3-1']
      },
      {
        title: "团队管理",
        path: "/team/team",
        role: ['3-2']
      }
    ],
  },
];
export default menuList;

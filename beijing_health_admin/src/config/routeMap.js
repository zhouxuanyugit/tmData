import Loadable from 'react-loadable';
import Loading from '@/components/Loading';
const family = Loadable({loader: () => import('@/views/family'),loading: Loading});

const taskTypeConfig = Loadable({loader: () => import('@/views/task/taskTypeConfig'),loading: Loading});
const taskList = Loadable({loader: () => import('@/views/task/taskList'),loading: Loading});

const chargeTypeConfig = Loadable({loader: () => import('@/views/charge/typeConfig'),loading: Loading});
const chargeReimburse = Loadable({loader: () => import('@/views/charge/reimburse'),loading: Loading});
const chargePay = Loadable({loader: () => import('@/views/charge/pay'),loading: Loading});
const chargeCashout = Loadable({loader: () => import('@/views/charge/cashout'),loading: Loading});

const systemRole = Loadable({loader: () => import('@/views/system/role'),loading: Loading});
const systemUser = Loadable({loader: () => import('@/views/system/user'),loading: Loading});
const systemExternalUser = Loadable({loader: () => import('@/views/system/externalUser'),loading: Loading});

const Error404 = Loadable({loader: () => import('@/views/error/404'),loading: Loading});

export default [
  { path: "/family/index", component: family },

  { path: "/task/type", component: taskTypeConfig },
  { path: "/task/list", component: taskList },

  { path: "/charge/type", component: chargeTypeConfig },
  { path: "/charge/reimburse", component: chargeReimburse },
  { path: "/charge/pay", component: chargePay },
  { path: "/charge/cashout", component: chargeCashout },

  { path: "/system/role", component: systemRole },
  { path: "/system/user", component: systemUser },
  { path: "/system/externalUser", component: systemExternalUser },

  { path: "/error/404", component: Error404 },
];

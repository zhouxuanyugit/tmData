import Loadable from 'react-loadable';
import Loading from '../components/Loading';
const Dashboard = Loadable({loader: () => import('../views/dashboard'),loading: Loading});
const patient = Loadable({loader: () => import('../views/patient'),loading: Loading});
const patientDetails = Loadable({loader: () => import('../views/patientDetails'),loading: Loading});

const doctorAdviceList = Loadable({loader: () => import('../views/doctorAdvice/list'),loading: Loading});
const doctorAdviceSheet = Loadable({loader: () => import('../views/doctorAdvice/sheet'),loading: Loading});

const consultationList = Loadable({loader: () => import('../views/consultation/list'),loading: Loading});
const consultationSheet = Loadable({loader: () => import('../views/consultation/sheet'),loading: Loading});

const systemRole = Loadable({loader: () => import('../views/system/role'),loading: Loading});
const systemUser = Loadable({loader: () => import('../views/system/user'),loading: Loading});
const systemAuthCode = Loadable({loader: () => import('../views/system/authCode'),loading: Loading});

const Log = Loadable({loader: () => import('../views/log'),loading: Loading});

const Error404 = Loadable({loader: () => import('../views/error/404'),loading: Loading});

export default [
  { path: "/dashboard", component: Dashboard },
  { path: "/patient", component: patient },
  { path: "/patient/details/:id", component: patientDetails },

  { path: "/doctorAdvice/list/:type", component: doctorAdviceList },
  { path: "/doctorAdvice/sheet", component: doctorAdviceSheet },

  { path: "/consultation/list", component: consultationList },
  { path: "/consultation/sheet", component: consultationSheet },

  { path: "/system/role", component: systemRole },
  { path: "/system/user", component: systemUser },
  { path: "/system/authCode", component: systemAuthCode },

  { path: "/log", component: Log },

  { path: "/error/404", component: Error404 },
];

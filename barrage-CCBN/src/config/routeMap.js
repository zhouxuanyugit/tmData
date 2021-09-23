import Loadable from 'react-loadable';
import Loading from '@/components/Loading';

const home = Loadable({loader: () => import('@/views/home'),loading: Loading});
const comments = Loadable({loader: () => import('@/views/comments'),loading: Loading});
const manage = Loadable({loader: () => import('@/views/manage'),loading: Loading});
const details = Loadable({loader: () => import('@/views/details'),loading: Loading});

const Error404 = Loadable({loader: () => import('@/views/error/404'),loading: Loading});

export default [
  { path: "/home", component: home },
  { path: "/comments", component: comments },
  { path: "/manage", component: manage },
  { path: "/details", component: details },

  { path: "/error/404", component: Error404 },
];

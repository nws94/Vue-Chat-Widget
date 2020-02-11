import store from '../store'

const routes = [
  {
  path: '/login',
  name: 'login',
  component: () => import("../components/Login/Login.vue")
},
{
  path: '/register',
  name: 'register',
  component: () => import("../components/Register/Register.vue")
},{
  path: "/performance",
  name: "performance",
  component: () => import("../components/Performance/Performance.vue"),
}, {
  path: "/performance/write",
  name: "performance-write",
  component: () => import("../components/Performance/Performance-Write.vue"),
  beforeEnter (to, from, next) {
    store.dispatch("GET_PERFORMANCEID");
    next();
  }
},{
  path: "/performance/detail",
  name: "performance-detail",
  component: () => import("../components/Performance/Performance-Detail.vue"),
},{
  path: "/performance/edit",
  name: "performance-edit",
  component: () => import("../components/Performance/Performance-Edit.vue"),
}
]

export default routes;
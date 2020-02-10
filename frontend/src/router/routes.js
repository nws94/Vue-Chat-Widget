



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
}
]

export default routes;
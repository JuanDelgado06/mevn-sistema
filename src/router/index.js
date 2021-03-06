import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
// import store from '../store/'
// import store from 'src/store/login/index'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store, ssrContext }) {
  const router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.libre)) {
      next()
    } else if (
      store.state.login.usuario &&
      store.state.login.usuario.rol === 'Administrador'
    ) {
      if (to.matched.some(record => record.meta.administrador)) {
        next()
      }
    } else if (
      store.state.login.usuario &&
      store.state.login.usuario.rol === 'Vendedor'
    ) {
      console.log(store.state.login.usuario.rol)
      if (to.matched.some(record => record.meta.vendedor)) {
        next()
      }
    } else if (
      store.state.login.usuario &&
      store.state.login.usuario.rol === 'Almacenero'
    ) {
      if (to.matched.some(record => record.meta.almacenero)) {
        next()
      }
    } else {
      next({ name: 'login' })
    }
  })

  return router
}

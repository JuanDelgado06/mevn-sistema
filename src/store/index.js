import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Vuelidate from 'vuelidate'

// import example from './module-example'
import login from './login'

Vue.use(Vuex)
Vue.use(Vuelidate)

axios.defaults.baseURL = 'http://localhost:3000/api'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      login
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./login'], () => {
      const newLogin = require('./login').default
      Store.hotUpdate({ modules: { login: newLogin } })
    })
  }

  return Store
}

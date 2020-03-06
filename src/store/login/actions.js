// import routes from '../../router'
import routes from '../../router/routes'
import decode from 'jwt-decode'

export function guardarToken ({ commit }, token) {
  commit('setToken', token)
  commit('setUsuario', decode(token))
  localStorage.setItem('token', token)
}
export function autoLogin ({ commit }) {
  const token = localStorage.getItem('token')
  if (token) {
    commit('setToken', token)
    commit('setUsuario', decode(token))
  }
  routes.push({ name: 'home' })
}
export function salir ({ commit }) {
  commit('setToken', null)
  commit('setUsuario', null)
  localStorage.removeItem('token')
  routes.push({ name: 'login' })
}

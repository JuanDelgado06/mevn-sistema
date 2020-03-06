const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Index.vue'),
        meta: {
          administrador: true,
          almacenero: true,
          vendedor: true
        }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/Login.vue'),
        meta: {
          libre: true
        }
      },
      {
        path: 'categoria',
        name: 'categoria',
        component: () => import('pages/Categoria.vue'),
        meta: {
          administrador: true,
          almacenero: true
        }
      },
      {
        path: 'usuario',
        name: 'usuario',
        component: () => import('pages/Usuario.vue'),
        meta: {
          administrador: true
        }
      },
      {
        path: 'articulo',
        name: 'articulo',
        component: () => import('pages/Articulo.vue'),
        meta: {
          administrador: true,
          almacenero: true
        }
      }
    ]
  }
  // {
  //   path: '/hola',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Hola.vue') }
  //   ]
  // },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

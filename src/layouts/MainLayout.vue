<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
          v-if="logueado"
        />

        <q-toolbar-title
          class="title-logo"
          v-if="esAdmin || esAlmacenero || esVendedor"
        >
          <router-link to="/">Quasar App</router-link>
        </q-toolbar-title>

        <div>
          <q-btn
            size="md"
            flat
            color="#f1f1f1"
            icon="exit_to_app"
            @click="salir"
            v-if="logueado"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="true"
      v-if="logueado"
      bordered
      :overlay="false"
      content-class="bg-grey-1"
    >
      <q-list>
        <!-- <q-item-label header class="text-grey-8">Lista de Links</q-item-label> -->
        <!-- <ExpansionLink
          v-for="link in ExpansionLinks"
          :key="link.title"
          v-bind="link"
          :v-show="link.condition"
        /> -->
        <!-- EXPANSION LINK 1 -->
        <q-expansion-item
          expand-separator
          icon="edit"
          label="Almacen"
          active-class="expansion-item"
          v-if="esAdmin || esAlmacenero"
        >
          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
            </router-link>

            <router-link to="categoria">
              <q-item-section>
                <q-item-label>
                  Categorias
                </q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="articulo">
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
            </router-link>

            <router-link to="articulo">
              <q-item-section>
                <q-item-label>Articulo</q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

        </q-expansion-item>
        <!-- EXPANSION LINK 1 -->
        <!-- EXPANSION LINK 2 -->
        <q-expansion-item
          expand-separator
          icon="edit"
          label="Compras"
          active-class="expansion-item"
          v-if="esAdmin || esAlmacenero"
        >
          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
            </router-link>

            <router-link to="home">
              <q-item-section>
                <q-item-label>
                  Ingresos
                </q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
            </router-link>

            <router-link to="home">
              <q-item-section>
                <q-item-label>Proveedores</q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

        </q-expansion-item>
        <!-- EXPANSION LINK 2 -->
        <!-- EXPANSION LINK 3 -->
        <q-expansion-item
          expand-separator
          icon="edit"
          label="Ventas"
          active-class="expansion-item"
          v-if="esAdmin || esVendedor"
        >
          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
            </router-link>

            <router-link to="home">
              <q-item-section>
                <q-item-label>
                  Ventas
                </q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
            </router-link>

            <router-link to="home">
              <q-item-section>
                <q-item-label>Clientes</q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

        </q-expansion-item>
        <!-- EXPANSION LINK 3 -->
        <!-- EXPANSION LINK 4-->
        <q-expansion-item
          expand-separator
          icon="edit"
          label="Consultas"
          active-class="expansion-item"
          v-if="esAdmin || esAlmacenero || esVendedor"
        >
          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
            </router-link>

            <router-link to="home">
              <q-item-section>
                <q-item-label>
                  Consulta compras
                </q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

          <q-item
            clickable
            tag="a"
            to="#"
            class="in-expansion-item"
          >
            <router-link to="categoria">
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
            </router-link>

            <router-link to="home">
              <q-item-section>
                <q-item-label>Consulta ventas</q-item-label>
              </q-item-section>
            </router-link>
          </q-item>

        </q-expansion-item>
        <!-- EXPANSION LINK 4-->
        <q-item
          clickable
          tag="a"
          to="usuario"
          v-if="esAdmin"
        >
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Usuarios</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import ExpansionLink from 'components/ExpansionLinks'

export default {
  name: 'MainLayout',
  components: {
    // ExpansionLink
  },
  data () {
    return {
      leftDrawerOpen: false,
      ExpansionLinks: [
        {
          title: 'Almacen',
          icon: 'home',
          title_item: 'Categoria',
          icon_item: 'code',
          title_item2: 'Articulo',
          icon_item2: 'code',
          link: 'categoria',
          link2: 'categoria'
        },
        {
          title: 'Compras',
          icon: 'home',
          title_item: 'Ingresos',
          icon_item: 'code',
          title_item2: 'Proveedores',
          icon_item2: 'code',
          link: 'categoria',
          link2: 'home'
        }
      ]
    }
  },
  computed: {
    logueado () {
      return this.$store.state.login.usuario
    },
    esAdmin () {
      return (
        this.$store.state.login.usuario &&
        this.$store.state.login.usuario.rol === 'Administrador'
      )
    },
    esAlmacenero () {
      return (
        this.$store.state.login.usuario &&
        this.$store.state.login.usuario.rol === 'Almacenero'
      )
    },
    esVendedor () {
      return (
        this.$store.state.login.usuario &&
        this.$store.state.login.usuario.rol === 'Vendedor'
      )
    }
  },
  methods: {
    salir () {
      this.$store.dispatch('login/salir')
      this.$router.push({ name: 'login' })
    }
  },
  created () {
    this.$store.dispatch('login/autoLogin')
    this.$router.push({ name: 'home' })
    // if (this.logueado) {
    // }
  }
}
</script>

<style lang="scss">
.in-expansion-item {
  margin-left: 1rem;
}
.expansion-item {
  background: yellow;
}
</style>

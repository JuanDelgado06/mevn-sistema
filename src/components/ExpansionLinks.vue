<template>
  <q-expansion-item
    expand-separator
    :icon="icon"
    :label="title"
    active-class="expansion-item"
    :v-show="condition"
  >
      <q-item
        clickable
        tag="a"
        to="#"
        class="in-expansion-item"
      >
        <router-link :to="link">
          <q-item-section avatar>
            <q-icon :name="icon_item" />
          </q-item-section>
        </router-link>

        <router-link :to="link">
          <q-item-section>
              <q-item-label>
                {{ title_item }}
              </q-item-label>
          </q-item-section>
        </router-link>
      </q-item>

    <q-item
      clickable
      tag="a"
      to="#"
      class="in-expansion-item"
      v-if="title_item2"
    >
      <router-link :to="link2">
        <q-item-section avatar>
          <q-icon :name="icon_item2" />
        </q-item-section>
      </router-link>

      <router-link :to="link2">
        <q-item-section>
          <q-item-label>{{ title_item2 }}</q-item-label>
        </q-item-section>
      </router-link>
    </q-item>

  </q-expansion-item>
</template>

<script>
export default {
  name: 'ExpasionLink',
  props: {
    condition: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    title_item: {
      type: String
    },
    icon_item: {
      type: String
    },
    title_item2: {
      type: String
    },
    icon_item2: {
      type: String
    },
    link: {
      type: String
    },
    link2: {
      type: String
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
  }
}
</script>

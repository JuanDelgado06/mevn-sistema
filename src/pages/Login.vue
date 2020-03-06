<template>
  <q-page class="flex flex-center my-container">
    <div class="form-container shadow-3">
      <h2 class="title title-login">Ingresar al sistema</h2>

      <q-form @submit="ingresar" @reset="onReset" class="form-login">
        <q-input v-model="email" type="email" label="Email" autofocus />
        <q-input v-model="password" type="password" label="Contraseña" />

        <!-- <p v-if="errorMessage">{{errorMessage}}</p> -->

        <div class="form-btn">
          <q-btn label="Limpiar" type="reset" color="primary" outline />
          <q-btn
            label="Ingresar"
            type="submit"
            color="primary"
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
// import loginModule from '../store/login'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      errorMessage: null
    }
  },
  methods: {
    ingresar () {
      axios
        .post('usuario/login', {
          email: this.email,
          password: this.password
        })
        .then(response => response.data)
        .then(data => {
          this.$store.dispatch('login/guardarToken', data.tokenReturn)
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          this.errorMessage = null

          if (err.response.status === 404) {
            this.errorMessage = 'No existe el usuario o las credenciales son incorrectas'
            this.$q.notify({
              message: 'No existe el usuario o la contraseña es incorrecta',
              color: 'negative',
              icon: 'error'
              // position: 'top-right'
            })
          } else {
            this.errorMessage = 'Ocurrio un error con el servidor'
          }
        })
    },
    onReset () {
      this.email = ''
      this.password = ''
    }
  }
}
</script>

<style lang="scss">
@import "../css/app";
.title-login {
  margin: 1rem 0 2rem;
  text-align: center;
  color: $primary;
}
.form {
  &-container {
    border: 2px solid $primary;
    border-radius: 1rem;
    width: 90%;
    @include respond-to(small) {
      width: 50%;
    }
    padding: 1rem;
  }
  &-login {
    // width: 100%;
    padding: 1rem;
  }
  &-btn {
    text-align: right;
    margin-top: 1rem;
  }
}
</style>

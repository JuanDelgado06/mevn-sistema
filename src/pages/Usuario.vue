<template>
  <div class="q-pa-md my-container">
    <q-table
      title="Usuarios"
      :data="usuarios"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      row-key="nombre"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-btn
          icon="add"
          color="primary"
          class="add"
          @click="dialog = true"
        />

        <q-input
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="opciones">
            <q-btn
              flat
              dense
              round
              @click="editItem(props.row)"
              icon="edit"
              color="blue-6"
              aria-label="Editar"
            />
            <template v-if="props.row.estado">
              <q-btn
                flat
                dense
                round
                @click="activarDesactivarMostrar(2, props.row)"
                icon="block"
                color="negative"
                aria-label="Desactivar"
              />
            </template>
            <template v-else>
              <q-btn
                flat
                dense
                round
                @click="activarDesactivarMostrar(1, props.row)"
                icon="check"
                color="positive"
                aria-label="Activar"
              />
            </template>
          </q-td>

          <q-td key="nombre" :props="props"> {{ props.row.nombre }}</q-td>

          <q-td key="rol" :props="props"> {{ props.row.rol }} </q-td>

          <q-td key="tipo_documento" :props="props"> {{ props.row.tipo_documento }} </q-td>

          <q-td key="num_documento" :props="props"> {{ props.row.num_documento }} </q-td>

          <q-td key="direccion" :props="props"> {{ props.row.direccion }} </q-td>

          <q-td key="telefono" :props="props"> {{ props.row.telefono }} </q-td>

          <q-td key="email" :props="props"> {{ props.row.email }} </q-td>

          <q-td
            key="estado"
            :props="props"
          >
            <!-- {{ props.row.estado }} -->
            <spam
              v-if="props.row.estado"
              style="color: green;"
            >Activo</spam>
            <spam
              v-else
              style="color: red;"
            >Inactivo</spam>
          </q-td>

        </q-tr>
      </template>
    </q-table>

    <q-dialog
      v-model="dialog"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card class="add-card">
        <q-card-section>
          <div class="text-h6">{{ formTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p
            class="error center-text"
            v-if="ImRequired"
          >! Todos los campos en color rojo son requeridos ¡</p>

          <q-select filled v-model.trim="$v.rol.$model" :options="optionsRol" label="Rol" :class="!$v.email.required ? 'required' : 'valido' "/>

          <p
            class="error"
            v-if="!$v.nombre.maxLength"
          >
            ! El nombre es demasiado largo ¡
          </p>
          <q-input
            :class="!$v.email.required ? 'required' : 'valido' "
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Nombre"
            v-model.trim="$v.nombre.$model"
          ></q-input>

          <q-select filled v-model="tipo_documento" :options="optionsDoc" label="Tipo Documento" />

          <p class="error" v-if="!$v.num_documento.maxLength">
            ! El numero de documento no es correcto ¡
          </p>
           <q-input
            type="number"
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Numero documento"
            v-model.trim="$v.num_documento.$model"
           ></q-input>

          <p class="error" v-if="!$v.direccion.maxLength">
            ! La dirección no es correcto ¡
          </p>
           <q-input
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Numero dirección"
            v-model.trim="$v.direccion.$model"
           ></q-input>

           <q-input
            type="tel"
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Telefono"
            mask="###-####-###"
            v-model="telefono"
           ></q-input>

          <p class="error" v-if="!$v.email.email">
            ! El Email no es valido ¡
          </p>
           <q-input
            type="email"
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Email"
            v-model.trim="$v.email.$model"
            :class="!$v.email.required ? 'required' : 'valido' "
           ></q-input>

           <!-- v-if="editedIndex < 1" -->
           <q-input
            type="password"
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Contraseña"
            :class="!$v.email.required ? 'required' : 'valido' "
            v-model.trim="$v.password.$model"
           ></q-input>

          <p
            class="error-center"
            v-if="submitStatus === 'ERROR'"
          >
            Por favor, verifica que los campos sean correctos
          </p>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            @click="close"
          />
          <q-btn
            push
            label="Guardar"
            color="primary"
            @click="guardar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="adModal"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card class="add-card">
        <q-card-section v-if="adAccion === 1">
          <div class="text-h6">Activar la usuario</div>
        </q-card-section>
        <q-card-section v-if="adAccion === 2">
          <div class="text-h6">Desactivar la usuario</div>
        </q-card-section>

        <q-card-section>
          Vas a <span v-if="adAccion === 1">activar</span> <span v-if="adAccion === 2">desactivar</span> la usuario {{adNombre}}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
          ></q-btn>
          <!-- Boton para activar -->
          <q-btn
            v-if="adAccion===1"
            @click="activar"
            push
            label="Activar"
            color="primary"
          ></q-btn>
          <q-btn
            v-if="adAccion===2"
            @click="desactivar"
            push
            label="Desactivar"
            color="negative"
          ></q-btn>
        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { required, maxLength, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      add_usuario: false,
      edit_usuario: false,
      dialog: false,
      editedIndex: -1,
      model_usuario: 'Activo',
      options_usuario: ['Activo', 'Inactivo'],
      filter: '',
      usuarios: '',
      columns: [
        { name: 'opciones', align: 'left', label: 'Opciones', field: 'opciones', sortable: false },
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: row => row.nombre, format: val => `${val}`, sortable: true },
        { name: 'rol', align: 'left', label: 'Rol', field: 'rol', sortable: true },
        { name: 'tipo_documento', align: 'center', label: 'Tipo documento', field: 'tipo_documento', sortable: true },
        { name: 'num_documento', align: 'left', label: 'Numero documento', field: 'num_documento', sortable: false },
        { name: 'direccion', align: 'left', label: 'Dirección', field: 'direccion', sortable: false },
        { name: 'telefono', align: 'left', label: 'Telefono', field: 'telefono', sortable: false },
        { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: false },
        { name: 'estado', align: 'left', label: 'Estado', field: 'estado', sortable: true }
      ],
      loading: false,
      id: '',
      nombre: '',
      rol: '',
      rol2: null,
      optionsRol: [
        'Vendedor', 'Administrador', 'Almacenero'
      ],
      tipo_documento: '',
      optionsDoc: [
        'CD', 'CC', 'PA'
      ],
      num_documento: '',
      direccion: '',
      telefono: '',
      email: '',
      password: '',
      submitStatus: null,
      ImRequired: false,
      adModal: false,
      adAccion: 0,
      adNombre: '',
      adId: ''
    }
  },
  created () {
    this.listar()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva usuario' : 'Editar usuario'
    }
  },
  validations: {
    rol: {
      required
    },
    nombre: {
      required,
      maxLength: maxLength(50)
    },
    num_documento: {
      required,
      maxLength: maxLength(20)
    },
    direccion: {
      maxLength: maxLength(100)
    },
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    listar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .get('usuario/list', configuracion)
        .then(response => {
          this.usuarios = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    limpiar () {
      this.id = ''
      this.nombre = ''
      this.rol = ''
      this.tipo_documento = ''
      this.num_documento = ''
      this.direccion = ''
      this.telefono = ''
      this.email = ''
      this.password = ''
      this.editedIndex = -1
    },
    guardar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      if (this.editedIndex >= 1) {
        // Valicacion para editar
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'

          if (!this.nombre.required) {
            this.ImRequired = true
          }
        } else {
          // Codigo para editar
          axios
            .put('usuario/update', {
              _id: this.id,
              nombre: this.nombre,
              rol: this.rol,
              tipo_documento: this.tipo_documento,
              num_documento: this.num_documento,
              direccion: this.direccion,
              telefono: this.telefono,
              email: this.email,
              password: this.password
            }, configuracion)
            .then(response => {
              this.limpiar()
              this.close()
              this.listar()
            })
            .catch(error => {
              console.log(error)
            })
        }
      } else {
        // Validación  para guardar una nueva usuario
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'

          if (!this.nombre.required) {
            this.ImRequired = true
          }
        } else {
          // Codigo para guardar
          axios
            .post('usuario/add', {
              nombre: this.nombre,
              rol: this.rol,
              tipo_documento: this.tipo_documento,
              num_documento: this.num_documento,
              direccion: this.direccion,
              telefono: this.telefono,
              email: this.email,
              password: this.password
            }, configuracion)
            .then(response => {
              this.limpiar()
              this.close()
              this.loading = true
              setTimeout(() => {
                this.loading = false
                this.listar()
              }, 1000)
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    editItem (row) {
      this.id = row._id
      this.nombre = row.nombre
      this.rol = row.rol
      this.tipo_documento = row.tipo_documento
      this.num_documento = row.num_documento
      this.direccion = row.direccion
      this.telefono = row.telefono
      this.email = row.email
      this.password = row.password

      this.dialog = true
      this.editedIndex = 1
    },
    activarDesactivarMostrar (accion, row) {
      this.adModal = true
      this.adNombre = row.nombre
      this.adId = row._id
      if (accion === 1) {
        // Se va a activar
        this.adAccion = 1
      } else if (accion === 2) {
        // Se va a desactivar
        this.adAccion = 2
      } else {
        this.adModal = 0
      }
    },
    activar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .put('usuario/activate', {
          _id: this.adId
        }, configuracion)
        .then(response => {
          this.adModal = false
          this.adAccion = 0
          this.adNombre = ''
          this.adId = ''
          this.limpiar()
          this.close()
          this.listar()
        })
        .catch(error => {
          console.log(error)
        })
    },
    desactivar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .put('usuario/deactivate', {
          _id: this.adId
        }, configuracion)
        .then(response => {
          this.adModal = false
          this.adAccion = 0
          this.adNombre = ''
          this.adId = ''
          this.limpiar()
          this.close()
          this.listar()
        })
        .catch(error => {
          console.log(error)
        })
    },
    close () {
      this.ImRequired = false
      this.submitStatus = null
      this.limpiar()
      this.dialog = false
    }
  }
}
</script>

<style lang="scss">
.container {
  @media screen and(min-width: 600px) {
    width: 80%;
    margin: 0 auto;
  }
  .q-card__section {
    background: red !important;
  }
}
.add {
  margin-right: 1.2rem;
  &-card {
    width: 80%;
  }
}
.usuario {
  &-estado {
    margin-top: 1rem;
    width: 50%;
  }
}
.q-field {
  margin-bottom: 1rem;
}
.error {
  margin: 0;
  margin-left: 5px;
  padding: 0;
  font-size: 0.7rem;
  color: red;
  &-center {
    margin-top: 0;
    color: red;
    font-size: 0.8rem;
    text-align: center;
  }
}
.required {
  border: 1.5px solid rgba(241, 24, 60, 0.911);
  border-radius: 5px;
  transition: all 1s ease-in;
}
</style>

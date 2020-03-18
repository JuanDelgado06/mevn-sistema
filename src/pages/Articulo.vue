<template>
  <div class="q-pa-md my-container">
    <q-table
      title="Articulos"
      :data="articulos"
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
            <!-- <q-btn
              flat
              dense
              round
              @click="deleteItem(props.row)"
              icon="delete"
              aria-label="Eliminar"
            /> -->
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
          <!-- Solución a error donde no se muestran los articulos -->
          <q-td key="categoria" :props="props">{{ props.row.categoria.nombre }}</q-td>

          <q-td key="codigo" :props="props">{{ props.row.codigo }}</q-td>

          <q-td
            key="nombre"
            :props="props"
          >
            {{ props.row.nombre }}
          </q-td>

          <q-td
            key="descripcion"
            :props="props"
          >
            {{ props.row.descripcion }}
          </q-td>

          <q-td key="precio_venta" :props="props">{{ props.row.precio_venta }}</q-td>

          <q-td key="stock" :props="props">{{ props.row.stock }}</q-td>

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
            class="error"
            v-if="ImRequired"
          >! Este campo es requerido ¡</p>

          <q-select filled v-model="categoria" :options="categorias" label="Categoria" map-options/>

          <q-input
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Codigo"
            v-model="codigo"
           ></q-input>

          <p
            class="error"
            v-if="!$v.nombre.maxLength"
          >
            ! El nombre es demasiado largo ¡
          </p>
          <q-input
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Nombre"
            v-model.trim="$v.nombre.$model"
          ></q-input>

          <p
            class="error"
            v-if="!$v.descripcion.maxLength"
          >
            ! La descripcion es demasiado larga ¡
          </p>
          <q-input
            standout="bg-blue-6 text-white"
            debounce="300"
            label="Descripción"
            v-model.trim="$v.descripcion.$model"
          ></q-input>

          <q-input v-model="precio_venta"  standout="bg-blue-6 text-white" type="number" label="Precio de Venta" />

          <q-input v-model="stock"  standout="bg-blue-6 text-white" type="number" label="Stock" />

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
          <div class="text-h6">Activar la categoria</div>
        </q-card-section>
        <q-card-section v-if="adAccion === 2">
          <div class="text-h6">Desactivar la categoria</div>
        </q-card-section>

        <q-card-section>
          Vas a <span v-if="adAccion === 1">activar</span> <span v-if="adAccion === 2">desactivar</span> la categoria {{adNombre}}
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
import { required, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      add_categoria: false,
      edit_categoria: false,
      dialog: false,
      editedIndex: -1,
      filter: '',
      articulos: '',
      columns: [
        {
          name: 'opciones',
          align: 'left',
          label: 'Opciones',
          field: 'opciones'
        },
        {
          name: 'categoria',
          align: 'left',
          label: 'Categoria',
          field: 'categoria',
          sortable: true
        },
        {
          name: 'codigo',
          align: 'left',
          label: 'Codigo',
          field: 'codigo',
          sortable: false
        },
        {
          name: 'nombre',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.nombre,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'descripcion',
          align: 'left',
          label: 'Descripcion',
          field: 'descripcion',
          sortable: true
        },
        {
          name: 'precio_venta',
          align: 'left',
          label: 'Precio de venta',
          field: 'precio_venta',
          sortable: true
        },
        {
          name: 'stock',
          align: 'left',
          label: 'Stock',
          field: 'stock',
          sortable: true
        },
        {
          name: 'estado',
          align: 'left',
          label: 'Estado',
          field: 'estado',
          sortable: true
        }
      ],
      loading: false,
      id: '',
      categoria: '',
      categorias: [],
      codigo: 0,
      nombre: '',
      descripcion: '',
      precio_venta: 0,
      stock: 0,
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
  mounted () {
    this.selectCategoria()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva categoria' : 'Editar categoria'
    }
  },
  validations: {
    nombre: {
      required,
      maxLength: maxLength(50)
    },
    descripcion: {
      maxLength: maxLength(255)
    }
  },
  methods: {
    selectCategoria () {
      let categoriaArray = []
      const opciones = []
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios.get('categoria/list', configuracion).then(function (response) {
        categoriaArray = response.data
        categoriaArray.map(function (x) {
          opciones.push({ label: x.nombre, value: x._id })
        })
      }).catch(function (error) {
        console.log(error)
      })
      this.categorias = opciones
    },
    listar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .get('articulo/list', configuracion)
        .then(response => {
          this.articulos = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    limpiar () {
      this.id = ''
      this.categoria = ''
      this.codigo = ''
      this.nombre = ''
      this.descripcion = ''
      this.precio_venta = ''
      this.stock = ''
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
            .put('articulo/update', {
              _id: this.id,
              categoria: this.categoria.value,
              codigo: this.codigo,
              nombre: this.nombre,
              descripcion: this.descripcion,
              precio_venta: this.precio_venta,
              stock: this.stock
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
        // Validación  para guardar una nueva articulo
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'

          if (!this.nombre.required) {
            this.ImRequired = true
          }
        } else {
          // Codigo para guardar
          axios
            .post('articulo/add', {
              categoria: this.categoria.value,
              codigo: this.codigo,
              nombre: this.nombre,
              descripcion: this.descripcion,
              precio_venta: this.precio_venta,
              stock: this.stock
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
      this.categoria = row.categoria
      this.codigo = row.codigo
      this.nombre = row.nombre
      this.descripcion = row.descripcion
      this.precio_venta = row.precio_venta
      this.stock = row.stock

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
        .put('articulo/activate', {
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
        .put('articulo/deactivate', {
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
}
.add {
  margin-right: 1.2rem;
  &-card {
    width: 80%;
  }
}
.categoria {
  &-estado {
    margin-top: 1rem;
    width: 50%;
  }
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
</style>

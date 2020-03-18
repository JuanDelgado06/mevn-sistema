<template>
  <div class="q-pa-md my-container">

    <q-table
      title="Ingresos"
      :data="ingresos"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      row-key="nombre"
      binary-state-sort
      v-if="showNuevo == false"
    >
      <template v-slot:top-right>
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
        <q-btn
              icon="add"
              color="primary"
              class="add q-ml-md"
              @click="mostrarModal()"
          />
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="opciones">
            <template>
              <q-btn flat color="primary" icon="tab" @click="verIngreso(props.row)" />
            </template>
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

          <q-td key="usuario.nombre" :props="props"> {{ props.row.usuario.nombre }}</q-td>

          <q-td key="persona.nombre" :props="props"> {{ props.row.persona.nombre }} </q-td>

          <q-td key="tipo_comprobante" :props="props"> {{ props.row.tipo_comprobante }} </q-td>

          <q-td key="serie_comprobante" :props="props"> {{ props.row.serie_comprobante }} </q-td>

          <q-td key="num_comprobante" :props="props"> {{ props.row.num_comprobante }} </q-td>

          <q-td key="creadoAt" :props="props"> {{ props.row.creadoAt }} </q-td>

          <q-td key="impuesto" :props="props"> {{ props.row.impuesto }} </q-td>

          <q-td key="total" :props="props"> {{ props.row.total }} </q-td>

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
          <span> Seleccione un articulo </span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col">
                <q-input v-model="texto" @keyup.enter="listarArticulos" type="text" label="Buscar"/>
              <q-table
                title="Articulos"
                :data="articulos"
                :columns="columnsArticulos"
                :loading="loading"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="opciones">
                      <q-btn
                        flat
                        dense
                        round
                        @click="agregarDetalle(props.row)"
                        icon="add"
                        color="blue-6"
                        aria-label="Editar"
                      />
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
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cerrar"
            color="primary"
            @click="dialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container v-if="showNuevo">
        <q-layout>

          <div class="row q-mt-md">
            <div class="col">
              <p class="error" v-if="!$v.tipo_comprobante.required">Selecciona un tipo de comprobante</p>
              <q-select class="pr-2" v-model.trim="$v.tipo_comprobante.$model" :options="comprobantes" label="Tipo comprobante" />
            </div>

            <q-input class="col pr-2" type="number" v-model="serie_comprobante"  label="Serie comprobante" />

            <div class="col">
              <p class="error" v-if="!$v.persona.required">Selecciona un Proveedor</p>
              <q-select v-model.trim="$v.persona.$model" :options="personas" label="Proveedor" />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <p class="error" v-if="!$v.num_comprobante.required">Ingresa un numero de comprobante</p>
              <q-input class="pr-2" type="number" v-model.trim="$v.num_comprobante.$model"  label="Numero comprobante" />
            </div>

            <q-input class="col" v-model="impuesto"  label="Impuesto" />
          </div>

          <div class="row justify-start">
            <q-input v-model="codigo"  label="Codigo" class="col-7 pr-2" @keyup.enter="burcarCodigo()"/>

            <q-btn
              flat
              size="lg"
              color="primary"
              icon="list"
              class="col-1"
              @click="dialog = true"
            />
          </div>

          <div class="col" v-if="errorArticulo">
            <p>{{errorArticulo}}</p>
          </div>

          <div class="row">
              <q-table
                title="Detalles"
                :data="detalles"
                :columns="columnsDetalles"
                row-key="id"
                class="col"
              >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="borrar">
                        <q-btn color="primary" icon="delete" flat @click="eliminarDetalle(detalles, props.row)"/>
                      </q-td>
                      <td key="articulo" :props="props"> {{ props.row.articulo }}</td>
                      <td key="cantidad" :props="props">  <q-input v-model=" props.row.cantidad" type="number" label="Cantidad" /> </td>
                      <td key="precio" :props="props">  <q-input v-model=" props.row.precio" type="number" label="Precio" /></td>
                      <td :props="props">{{ props.row.cantidad * props.row.precio }}</td>
                    </q-tr>
                  </template>

                  <template>
                      <h3>No hay articulos agregados al detalle</h3>
                  </template>

              </q-table>
          </div>
          <div class="row q-mt-md">
              <div class="col text-center"><b>Total Parcil:</b> ${{totalParcial=(total - totalImpuesto).toFixed(2) }}</div>

              <div class="col text-center"><b>Total Impuesto:</b> ${{totalImpuesto=((total*  impuesto) /  (1+impuesto)).toFixed(2)}}</div>

              <div class="col text-center"><b>Total Neto:</b> ${{total=calcularTotal}}</div>
          </div>

          <div class="row justify-end">
            <q-btn color="primary"  class="q-mt-md q-mr-sm" label="Cancelar" @click.native="showNuevo = false" />
            <q-btn color="positive" v-if="verDetalle === true"  class="q-mt-md" label="Guardar" @click.native="guardar()" />
          </div>

        </q-layout>
    </q-page-container>

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
          Vas a <span v-if="adAccion === 1">activar</span> <span v-if="adAccion === 2">desactivar</span> el ingreso {{adNombre}}
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
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      add_usuario: false,
      edit_usuario: false,
      dialog: false,
      model_usuario: 'Activo',
      options_usuario: ['Activo', 'Inactivo'],
      filter: '',
      ingresos: '',
      columns: [
        { name: 'opciones', align: 'left', label: 'Opciones', field: 'opciones', sortable: false },
        { name: 'usuario.nombre', align: 'left', label: 'Usuario', field: 'usuario.nombre', sortable: true },
        { name: 'persona.nombre', align: 'left', label: 'Proovedor', field: 'persona.nombre', sortable: true },
        { name: 'tipo_comprobante', align: 'left', label: 'Tipo comprobante', field: 'tipo_comprobante', sortable: false },
        { name: 'serie_comprobante', align: 'left', label: 'Serie comprobante', field: 'serie_comprobante', sortable: false },
        { name: 'num_comprobante', align: 'left', label: 'Numero comprobante', field: 'num_comprobante', sortable: false },
        { name: 'creadoAt', align: 'left', label: 'Fecha', field: 'creadoAt', sortable: false },
        { name: 'impuesto', align: 'left', label: 'Impuesto', field: 'impuesto', sortable: false },
        { name: 'total', align: 'left', label: 'Total', field: 'total', sortable: false },
        { name: 'estado', align: 'left', label: 'Estado', field: 'estado', sortable: true }
      ],
      loading: false,
      id: '',
      persona: '',
      personas: [],
      tipo_comprobante: '',
      comprobantes: ['FACTURA', 'RECIBO'],
      serie_comprobante: '',
      num_comprobante: '',
      impuesto: 0.19,
      codigo: '',
      columnsDetalles: [
        { name: 'borrar', align: 'left', label: 'Borrar', field: 'borrar', sortable: false },
        { name: 'articulo', align: 'left', label: 'Articulo', field: 'articulo', sortable: true },
        { name: 'cantidad', align: 'left', label: 'Cantidad', field: 'cantidad', sortable: true },
        { name: 'precio', align: 'left', label: 'Precio', field: 'precio', sortable: false },
        { name: 'subtotal', align: 'left', label: 'Sub total', field: 'subtotal', sortable: false }
      ],
      detalles: [],
      showNuevo: false,
      errorArticulo: null,
      total: 0,
      totalParcial: 0,
      totalImpuesto: 0,
      articulos: [],
      texto: '',
      columnsArticulos: [
        {
          name: 'seleccionar',
          align: 'left',
          label: 'Seleccionar',
          field: 'seleccionar'
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
      verDetalle: false,
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
    this.selectPersona()
    this.calcularTotal()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva usuario' : 'Editar usuario'
    },
    calcularTotal: function () {
      let resultado = 0.0
      for (let i = 0; i < this.detalles.length; i++) {
        resultado = resultado + (this.detalles[i].cantidad * this.detalles[i].precio)
      }
      return resultado
    }
  },
  validations: {
    tipo_comprobante: {
      required
    },
    persona: {
      required
    },
    num_comprobante: {
      required
    },
    impuesto: {
      required
    }
  },
  methods: {
    selectPersona () {
      let personaArray = []
      const opciones = []
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios.get('persona/listProveedores', configuracion).then(function (response) {
        personaArray = response.data
        personaArray.map(function (x) {
          opciones.push({ label: x.nombre, value: x._id })
        })
      }).catch(function (error) {
        console.log(error)
      })
      this.personas = opciones
    },
    burcarCodigo () {
      // this.errorArticulo = null
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .get('articulo/queryCodigo?codigo=' + this.codigo, configuracion)
        .then(response => {
          this.agregarDetalle(response.data)
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
          this.errorArticulo = 'No existe el articulo'
        })
    },
    agregarDetalle (data) {
      this.errorArticulo = null
      if (this.encuentra(data._id)) {
        this.errorArticulo = 'El articulo ya ha sido agregado'
      } else {
        this.detalles.push(
          {
            _id: data._id,
            articulo: data.nombre,
            cantidad: 1,
            precio: data.precio_venta
          }
        )
        this.codigo = ''
      }
    },
    encuentra (id) {
      let sw = false
      for (let i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id === id) {
          sw = true
        }
      }
      return sw
    },
    eliminarDetalle (arr, item) {
      const i = arr.indexOf(item)
      if (i !== -1) {
        arr.splice(i, 1)
      }
    },
    listarArticulos () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .get('articulo/list?valor=' + this.texto, configuracion)
        .then(response => {
          this.articulos = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    listarDetalles (id) {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .get('ingreso/query?_id=' + id, configuracion)
        .then(response => {
          this.detalles = response.data.detalles
        })
        .catch(error => {
          console.log(error)
        })
    },
    verIngreso (item) {
      this.limpiar()
      this.tipo_comprobante = item.tipo_comprobante
      this.serie_comprobante = item.serie_comprobante
      this.num_comprobante = item.num_comprobante
      this.persona = item.persona._id
      this.impuesto = item.impuesto
      this.listarDetalles(item._id)
      this.showNuevo = true
      this.verIngreso = true
    },
    listar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      axios
        .get('ingreso/list', configuracion)
        .then(response => {
          this.ingresos = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    limpiar () {
      this.id = ''
      this.tipo_comprobante = ''
      this.serie_comprobante = ''
      this.num_comprobante = ''
      this.impuesto = 0.18
      this.codigo = 0
      this.total = 0
      this.totalParcial = 0
      this.totalImpuesto = 0
      this.detalles = []
      this.showNuevo = false
      this.verDetalle = false
    },
    mostrarModal () {
      this.showNuevo = true
      this.verDetalle = true
    },
    guardar () {
      const header = { Token: this.$store.state.login.token }
      const configuracion = { headers: header }
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'

        if (!this.nombre.required) {
          this.ImRequired = true
        }
      } else {
        // Codigo para editar
        axios
          .post('ingreso/add', {
            persona: this.persona.value,
            usuario: this.$store.state.login.usuario._id,
            tipo_comprobante: this.tipo_comprobante,
            serie_comprobante: this.serie_comprobante,
            num_comprobante: this.num_comprobante,
            impuesto: this.impuesto,
            total: this.total,
            detalles: this.detalles
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
    },
    activarDesactivarMostrar (accion, row) {
      this.adModal = true
      this.adNombre = row.num_comprobante
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
        .put('ingreso/activate', {
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
        .put('ingreso/deactivate', {
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

<template>
  <q-page padding>
    <div class="absolute-left">
      <br />
      <q-btn v-go-back.single color="primary" dense flat icon="arrow_back" label="Inapoi" />
    </div>
    <br />

    <!-- Tabel changes pt un prof -->
    <q-table
      v-if="isProfessor"
      title="Modificari"
      :data="changes"
      :filter="filter"
      :columns="columns"
      row-key="name"
      style="margin:50px"
    >
      <!-- Add new change -->
      <template v-slot:top-left>
        <q-btn color="primary" label="Inregistreaza modificare" @click="addChange" />
        <q-btn color="primary" label="Cerere" outline @click="toPDF" />
      </template>

      <!---Export data to csv btn--->
      <template v-slot:top-right>
        <q-btn color="primary" icon-right="archive" label="Export " no-caps @click="exportTable" />
      </template>
    </q-table>

    <!-- Tabel changes -->
    <q-table
      v-else
      title="Modificari asupra cererii de inscriere"
      :data="changes"
      :filter="filter"
      :columns="columns"
      row-key="name"
      style="margin:50px"
    >
      <!-- Print req  -->
      <template v-slot:top-left>
        <q-btn color="primary" label="Cerere " @click="toPDF" />
      </template>

      <!-- Filter req -->
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Cauta">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- Formular adaugare change -->
    <q-dialog v-model="card" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey">Adauga modifcare</div>
        </q-card-section>
        <!-- Campuri -->
        <q-card-section>
          <!-- change -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Titlul lucrarii:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedChange.title"
              dense
              autogrow
              label="Titlu"
              :rules="[val => !!val || 'Campul este obligatoriu!']"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Descriere modificare:&nbsp;</div>
            <q-input
              class="col-9"
              type="textarea"
              outlined
              v-model="selectedChange.body"
              dense
              label="Descriere"
              :rules="[val => !!val || 'Campul este obligatoriu!']"
            />
          </div>
          <!--  data -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Data modificare:</div>
            <q-input
              outlined
              dense
              type="date"
              class="col-9"
              v-model="selectedChange.modifyDate"
              mask="date"
            ></q-input>
          </div>
        </q-card-section>

        <!-- Adding/Editing -->
        <q-card-section>
          <q-card-actions align="around">
            <q-btn icon="add_circle" outline color="primary" @click="executeAddChange">Adauga</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { LocalStorage, exportFile } from 'quasar'

import jsPDF from 'jspdf'
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val
  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}
export default {
  beforeMount() {
    this.$store.dispatch('data/loadChangesForOneUser', this.idStudent)
    this.user = this.$q.localStorage.getItem('user')
    if (this.user.type === 'professor') {
      this.isProfessor = true
    } else {
      this.isProfessor = false
    }
    if (!this.user) {
      this.$router.push('/auth/login')
    }
  },
  data() {
    return {
      isProfessor: false,
      idStudent: this.$route.params.id,
      filter: '',
      card: false,
      selectedChange: {},
      columns: [
        {
          name: 'title',
          required: true,
          label: 'Titlul lucrarii ',
          align: 'left',
          field: row => row.title,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'body',
          required: true,
          label: 'Descriere ',
          align: 'left',
          field: row => row.body,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'modifyDate',
          required: true,
          label: 'Data ',
          align: 'left',
          field: row => row.modifyDate,
          format: val => `${val}`,
          sortable: true
        }
      ]
    }
  },
  methods: {
    exportTable() {
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.changes.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(',')
          )
        )
        .join('\r\n')

      const status = exportFile(
        `modificari_cerere_inscriere.csv`,
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    toPDF() {
      this.$router.push({ name: 'PDF2' })
    },
    addChange() {
      this.state = 'ADD'
      this.card = true
      this.selectedChange = {
        title: '',
        body: '',
        modifyDate: ''
      }
    },
    executeAddChange() {
      // console.log('addChange', {
      //   ...this.selectedChange,
      //   studentId: this.studentId
      // })
      this.$axios
        .post('/api/profStuds/changes', {
          ...this.selectedChange,
          studentId: this.studentId
        })
        .then(response => {
          this.$q.notify({
            color: 'green',
            message: response.data.message,
            icon: 'done'
          })
          this.$store.dispatch('data/loadChangesForOneUser', this.idStudent)
          this.card = false
        })
        .catch(error => {
          switch (error.response.status) {
            case 400: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: 'negative',
                  message: element
                })
              })
              break
            }
            default: {
              this.$q.notify({
                color: 'negative',
                message: error.response.data.message
              })
            }
          }
        })
    }
  },
  computed: {
    changes() {
      return this.$store.getters['data/getChanges']
    },
    studentId() {
      return this.$route.params.id
    }
  }
}
</script>

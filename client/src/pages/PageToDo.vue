<template>
  <q-page>
    <div class="absolute-left">
      <br />
      <q-btn v-go-back.single color="primary" dense flat icon="arrow_back" label="Inapoi" />
    </div>
    <br />

    <!-- Tabel tasks pt un prof -->
    <q-table
      v-if="isProfessor"
      title="Activitati"
      :data="tasks"
      :filter="filter"
      :columns="columns"
      row-key="name"
      style="margin:50px"
    >
      <!-- Filter tasks -->
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Cauta">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <!-- Edit/Delete a task -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            class="button"
            outline
            style="margin-right:20px"
            @click="updateTask(props.row)"
            round
            color="primary"
            icon="create"
          />
          <q-btn
            class="button"
            outline
            @click="removeTask(props.row)"
            round
            color="negative"
            icon="delete"
          />
        </q-td>
      </template>

      <!-- Add new task -->
      <template v-slot:top-left>
        <q-btn color="primary" label="Adauga activitate" @click="addTask" />
      </template>
    </q-table>

    <!-- Tabel tasks -->
    <q-table
      v-else
      title="Vizualizare activitati propuse"
      :data="tasks"
      :filter="filter"
      :columns="columns"
      row-key="name"
      style="margin:50px"
    >
      <!-- Filter tasks -->
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Cauta">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- Formular adaugare task -->
    <q-dialog v-model="card" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" v-if="state === 'ADD'">Adauga activitate noua</div>
          <div class="col-3 text-grey" v-else>Editeaza activitate</div>
        </q-card-section>
        <!-- Campuri -->
        <q-card-section>
          <!-- Task -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Descriere activitate:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedTask.name"
              dense
              label="Descriere"
              :rules="[val => !!val || 'Campul este obligatoriu!']"
            />
          </div>
          <!-- Due date -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Data limita:</div>
            <q-input
              label="Data"
              outlined
              dense
              class="col-9"
              v-model="selectedTask.dueDate"
              mask="date"
              :rules="['date']"
            >
              <!-- Calendar pop up -->
              <template v-slot:append>
                <q-icon name="today" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="selectedTask.dueDate" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!-- Due time -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Ora limita:</div>
            <q-input
              label="Ora"
              outlined
              dense
              class="col-9"
              v-model="selectedTask.dueTime"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time now-btn v-model="selectedTask.dueTime" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <!-- Adding/Editing -->
        <q-card-section>
          <q-card-actions align="around">
            <q-btn
              icon="add_circle"
              outline
              color="primary"
              @click="executeAddTask"
              v-if="state === 'ADD'"
            >Adauga</q-btn>
            <q-btn
              icon="fas fa-edit"
              outline
              color="primary"
              v-else
              @click="executeSaveTask"
            >Editare</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
export default {
  beforeMount() {
    this.$store.dispatch('data/loadTasksForOneUser', this.idStudent)

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
      state: 'VIEW',
      filter: '',
      card: false,
      selectedTask: {},
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Descriere activitate',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'dueDate',
          required: true,
          label: 'Data limita',
          align: 'left',
          field: row => row.dueDate,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'dueTime',
          required: true,
          label: 'Ora limita',
          align: 'left',
          field: row => row.dueTime,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'actions',
          label: 'Actuni'
        }
      ]
    }
  },
  methods: {
    addTask() {
      this.state = 'ADD'
      this.card = true
      this.selectedTask = {
        name: '',
        dueDate: '',
        dueTime: ''
      }
    },
    updateTask(task) {
      this.state = 'EDIT'
      this.card = true
      this.selectedTask = {
        ...task
      }
    },
    removeTask(task) {
      this.$q
        .dialog({
          title: 'Confirmare',
          message: `Doriti sa stergeti activitatea ${task.name} ?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete(`api/profStuds/tasks/${task.id}`, {
              data: { id: task.id }
            })
            .then(response => {
              this.$q.notify({
                color: 'green',
                message: response.data.message,
                icon: 'arrow_forward'
              })
              this.$store.dispatch('data/loadTasksForOneUser', this.idStudent)
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
        })
    },
    executeSaveTask() {
      this.$axios
        .put(`/api/profStuds/tasks/${this.selectedTask.id}`, {
          ...this.selectedTask
        })
        .then(response => {
          this.$q.notify({
            color: 'green',
            message: response.data.message,
            icon: 'done'
          })
          this.$store.dispatch('data/loadTasksForOneUser', this.idStudent)
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
    },
    executeAddTask() {
      console.log('addTASK', {
        ...this.selectedTask,
        studentId: this.studentId
      })
      this.$axios
        .post('/api/profStuds/tasks', {
          ...this.selectedTask,
          studentId: this.studentId
        })
        .then(response => {
          this.$q.notify({
            color: 'green',
            message: response.data.message,
            icon: 'done'
          })
          this.$store.dispatch('data/loadTasksForOneUser', this.idStudent)
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
    tasks() {
      return this.$store.getters['data/getTasks']
    },
    studentId() {
      return this.$route.params.id
    }
  }
}
</script>
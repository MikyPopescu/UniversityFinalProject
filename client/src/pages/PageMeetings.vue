<template>
  <q-page>
    <div class="absolute-left">
      <br />
      <q-btn v-go-back.single color="primary" dense flat icon="arrow_back" label="Inapoi" />
    </div>
    <br />

    <!--Tabel Meetings
  PENTRU PROFESOR
    -->
    <q-table
      flat
      bordered
      v-if="isProfessor"
      title="Intalniri"
      :data="meetings"
      :columns="columns"
      row-key="name"
      hide-bottom
      hide-header
      :filter="filter"
      style="margin:50px"
    >
      <!-- Filter meetings
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Cauta">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>-->

      <!---Edit/Delete a meeting--->
      <template v-if="isProfessor" v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            outline
            style="margin-right:20px"
            @click="updateMeeting(props.row)"
            round
            color="primary"
            icon="create"
          />
          <q-btn outline @click="removeMeeting(props.row)" round color="negative" icon="delete" />
        </q-td>
      </template>

      <!--Add new meeting-->
      <template v-slot:top-right>
        <q-btn
          outline
          v-if="isProfessor"
          color="primary"
          label="Propuneti intalnire"
          @click="addMeeting"
        />
      </template>
    </q-table>

    <!--STUDENT--->
    <q-table
      v-else
      flat
      bordered
      title="Intalniri"
      :data="meetings"
      :columns="columns"
      row-key="name"
      hide-bottom
      :filter="filter"
      style="margin:50px"
    >
      <!-- Filter meetings 
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Cauta">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>-->
    </q-table>

    <!-- Formular adaugare intalnire -->
    <q-dialog v-model="card" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" v-if="state === 'ADD'">Adauga intalnire noua</div>
          <div class="col-3 text-grey" v-else>Editeaza intalnire</div>
        </q-card-section>

        <!---Campuri--->
        <q-card-section>
          <!--- Intalnire --->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Locatia:</div>
            <q-input
              clearable
              class="col-9"
              type="text"
              v-model="selectedMeeting.location"
              dense
              :rules="[val => !!val || 'Campul este obligatoriu!']"
            />
          </div>

          <!--- date --->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Data propusa:</div>
            <q-input
              clearable
              dense
              class="col-9"
              v-model="selectedMeeting.date"
              mask="date"
              :rules="['date']"
            >
              <!---Calendar pop up --->
              <template v-slot:append>
                <q-icon name="fas fa-calendar" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date landscape v-model="selectedMeeting.date" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!--- time --->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Ora propusa:</div>
            <q-input
              dense
              clearable
              class="col-9"
              v-model="selectedMeeting.time"
              mask="time"
              :rules="['time']"
            >
              <template v-slot:append>
                <q-icon name="fas fa-stopwatch" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time landscape now-btn v-model="selectedMeeting.time" />
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
              icon="fas fa-plus-square"
              outline
              color="primary"
              @click="executeAddMeeting"
              v-if="state === 'ADD'"
            >Adaugare</q-btn>
            <q-btn
              icon="fas fa-edit"
              outline
              color="primary"
              v-else
              @click="executeSaveMeeting"
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
    this.$store.dispatch('data/loadMeetingsForOneUser', this.idStudent)
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
      selectedMeeting: {},

      columns: [
        {
          name: 'date',
          required: true,
          label: 'Data propusa',
          align: 'left',
          field: row => row.date,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'time',
          required: true,
          label: 'Ora propusa',
          align: 'left',
          field: row => row.time,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'location',
          required: true,
          label: 'Locatie',
          align: 'left',
          field: row => row.location,
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
    addMeeting() {
      this.state = 'ADD'
      this.card = true
      this.selectedMeeting = {
        location: '',
        date: '',
        time: ''
      }
    },
    updateMeeting(meeting) {
      this.state = 'EDIT'
      this.card = true
      this.selectedMeeting = {
        ...meeting
      }
    },
    removeMeeting(meeting) {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Doriti sa stergeti intalnirea de la sala ${meeting.location} ?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete(`api/profStuds/meetings/${meeting.id}`, {
              data: { id: meeting.id }
            })
            .then(response => {
              this.$q.notify({
                color: 'green',

                message: response.data.message,
                icon: 'arrow_forward'
              })
              this.$store.dispatch(
                'data/loadMeetingsForOneUser',
                this.idStudent
              )
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
    executeSaveMeeting() {
      this.$axios
        .put(`/api/profStuds/meetings/${this.selectedMeeting.id}`, {
          ...this.selectedMeeting
        })
        .then(response => {
          this.$q.notify({
            color: 'green',

            message: response.data.message,
            icon: 'done'
          })

          this.$store.dispatch('data/loadMeetingsForOneUser', this.idStudent)
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
    executeAddMeeting() {
      console.log('addMeeting', {
        ...this.selectedMeeting,
        studentId: this.studentId
      })
      this.$axios
        .post('/api/profStuds/meetings', {
          ...this.selectedMeeting,
          studentId: this.studentId
        })
        .then(response => {
          this.$q.notify({
            color: 'green',
            message: response.data.message,
            icon: 'done'
          })
          this.$store.dispatch('data/loadMeetingsForOneUser', this.idStudent)
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
    meetings() {
      return this.$store.getters['data/getMeetings']
      return this.$store.getters['data/getAllMeetings']
    },
    studentId() {
      return this.$route.params.id
    }
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="content">
      <div class="q-pa-xs">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <!-- Optiuni tab -->
          <q-tab name="my_coordinator" label="Studentii mei" />
          <q-tab name="req_coordinator" label="Solicitari studenti" />
        </q-tabs>
      </div>
      <q-separator />
      <!-- Continut tabs -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="my_coordinator">
          <!--- My coordinator ---->
          <!-- <h4 style="text-align:center">Studenti asignati</h4> -->
          <div class="q-pa-md row items-start q-gutter-md">
            <q-card style="width:28%" v-for="assigned in assigns" :key="assigned.id">
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input readonly v-model="assigned.student.lastName" label="Nume" />
                  <q-input readonly v-model="assigned.student.firstName" label="Prenume" />
                  <q-input readonly v-model="assigned.student.email" label="Email" />
                </q-form>
              </q-card-section>
              <q-card class="my-card">
                <q-separator />

                <q-card-actions align="center">
                  <q-btn
                    flat
                    @click="toTodo(assigned.student.id)"
                    icon="fas fa-tasks"
                    class="text-primary"
                  />

                  <q-btn
                    flat
                    @click="toMessage(assigned.student.id)"
                    icon="fas fa-comments"
                    class="text-primary"
                  />
                  <q-btn
                    flat
                    @click="toPaper(assigned.student.id)"
                    icon="fas fa-copy"
                    class="text-primary"
                  />
                  <q-btn
                    flat
                    @click="toMeetings(assigned.student.id)"
                    icon="fas fa-handshake"
                    class="text-primary"
                  />
                  <q-btn
                    flat
                    @click="rejectStudent(assigned.student.id)"
                    icon="fas fa-user-minus"
                    color="red"
                  />
                </q-card-actions>
              </q-card>
            </q-card>
          </div>
        </q-tab-panel>
        <!-- Requests -->
        <q-tab-panel name="req_coordinator">
          <q-item v-for="pending in pendings" :key="pending.id">
            <q-item-section avatar top>
              <q-icon name="person" color="primary" size="50px" />
            </q-item-section>

            <q-item-section top>
              <q-item-label lines="1">
                <span class="text-weight-medium">
                  {{ pending.student.lastName }}&nbsp;{{
                  pending.student.firstName
                  }}
                </span>
              </q-item-label>

              <q-item-label caption lines="1">
                {{
                pending.student.email
                }}
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  class="gt-xs"
                  size="16px"
                  color="red"
                  flat
                  dense
                  round
                  icon="fas fa-minus-circle"
                  @click="rejectStudent(pending.student.id)"
                />
                <q-btn
                  class="gt-xs"
                  size="16px"
                  color="green"
                  flat
                  dense
                  round
                  icon="fas fa-check-circle"
                  @click="approveStudent(pending.student.id)"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Coord',
  beforeMount() {
    this.user = this.$q.localStorage.getItem('user')
    if (this.user.type === 'professor') {
      this.isProfessor = true
    } else {
      this.isProfessor = false
    }

    if (!this.user) {
      this.$router.push('/auth/login')
    } else {
      this.$store.dispatch('data/loadPendingStudents')
      this.$store.dispatch('data/loadAsignedStudents')
    }
  },

  data() {
    return {
      tab: 'my_coordinator',
      contentStyle: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      },

      contentActiveStyle: {
        backgroundColor: '#eee',
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  methods: {
    toTodo(id) {
      this.$router.push({ name: 'Todo', params: { id } })
    },
    toMeetings(id) {
      this.$router.push({ name: 'Meetings', params: { id } })
    },
    toMessage(id) {
      this.$router.push({ name: 'Messages', params: { id } })
    },
    toPaper(id) {
      this.$router.push({ name: 'Request', params: { id } })
    },
    approveStudent(studId) {
      this.$axios
        .post('/api/profStuds/students', {
          id: studId
        })
        .then(response => {
          this.$q.notify({
            color: 'green',
            message: response.data.message,
            icon: 'check'
          })
          this.$store.dispatch('data/loadPendingStudents')
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
    rejectStudent(studId) {
      this.$q
        .dialog({
          title: 'Stergere student',
          message: `Doriti sa stergeti studentul selectat ?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .post(`/api/profStuds/student`, {
              id: studId
            })
            .then(response => {
              this.$q.notify({
                color: 'orange',
                message: response.data.message,
                icon: 'remove_circle'
              })
              this.$store.dispatch('data/loadPendingStudents')
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
    }
  },
  computed: {
    assigns() {
      return this.$store.getters['data/getAsignedStudents']
    },
    pendings() {
      return this.$store.getters['data/getPendingStudents']
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
<style>
.content {
  width: 100vw;
  height: 100vw;
}
</style>

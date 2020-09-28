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
          <!--Optiuni tab--->
          <q-tab name="my_coordinator" label="Coordonatorul meu"></q-tab>
          <q-tab name="req_coordinator" label="Solicita coordonator"></q-tab>
        </q-tabs>
      </div>
      <q-separator />
      <!---Continut tabs---->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="my_coordinator">
          <!--- My coordinator ---->
          <div class="text-h6">Coordonator stiintific</div>
          <div v-if="!professor.lastName" class="col-lg-8 col-md-8 col-xs-12 col-sm-12 column">
            <q-card>
              <h5>&nbsp;&nbsp;Solicitati coordonator din zona 'Solicita coordonator'</h5>
            </q-card>
          </div>
          <div v-else class="col-lg-8 col-md-8 col-xs-12 col-sm-12 column">
            <q-card>
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input readonly v-model="professor.lastName" label="Nume" />
                  <q-input readonly v-model="professor.firstName" label="Prenume" />
                  <q-input readonly v-model="professor.email" label="Email" />
                </q-form>
              </q-card-section>
            </q-card>
          </div>

          <div v-if="professor.lastName" class="q-pa-md" style="padding-bottom: 220px">
            <div>
              <q-fab
                v-model="fab"
                label="Operatiuni"
                label-position="left"
                color="primary"
                icon="keyboard_arrow_right"
                direction="right"
              >
                <q-fab-action
                  color="purple"
                  @click="toTodo(professor.id)"
                  icon="list"
                  label="Activitati"
                />
                <q-fab-action
                  color="blue"
                  @click="toMessages(professor.id)"
                  icon="message"
                  label="Mesaje"
                />
                <q-fab-action
                  @click="toRequest(professor.id)"
                  color="red"
                  icon="edit"
                  label="Tema"
                />

                <q-fab-action
                  color="secondary"
                  @click="toMeetings(professor.id)"
                  icon="alarm"
                  label="Intalniri"
                />
              </q-fab>
            </div>
          </div>
        </q-tab-panel>
        <!--- Req coordinator ---->
        <q-tab-panel @click="getCoordinators" name="req_coordinator">
          <div class="col-12"></div>

          <div class="text-h6">Coordonatori:</div>

          <q-item v-for="professor in professors" :key="professor.id">
            <q-item-section avatar top>
              <q-icon name="person" color="primary" size="50px" />
            </q-item-section>

            <q-item-section top>
              <q-item-label lines="1">
                <!-- <span class="text-grey-10">conf. univ. dr.&nbsp;&nbsp;</span> -->
                <span class="text-weight-medium">{{professor.firstName }} {{professor.lastName}}</span>
              </q-item-label>

              <q-item-label caption lines="1">{{professor.email}}</q-item-label>
              <!-- <q-item-label
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
              >
                <span class="cursor-pointer">
                
                  {{professor.currentStudents}}/ {{professor.maxStudents}}
                  <q-tooltip>Locuri ocupate</q-tooltip>
                </span>
              </q-item-label> 
              -->
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <!-- <q-btn class="gt-xs" size="16px" color="primary" flat dense round icon="message" /> -->
                <q-btn
                  class="gt-xs"
                  size="16px"
                  color="green"
                  dense
                  round
                  icon="add"
                  @click="addEntity(professor)"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <!-- 
          <div class="text-h6">Solicitari facute:</div>-->
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  beforeMount() {
    this.$store.dispatch('data/loadProfessors')
    this.$store.dispatch('data/loadProfessor')

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
      fab: false,
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
    toMessages(id) {
      this.$router.push({ name: 'Messages', params: { id } })
    },

    toMeetings(id) {
      this.$router.push({ name: 'Meetings', params: { id } })
    },
    toRequest(id) {
      this.$router.push({ name: 'Request', params: { id } })
    },
    addEntity(professor) {
      this.$axios
        .post('/api/profStuds', {
          id: professor.id
        })
        .then(response => {
          this.$q.notify({
            type: 'positive',
            message: `Solicitarea a fost trimisa catre ${professor.firstName} ${professor.lastName}`
          })
        })
        .catch(error => {
          console.log(error.response.data)
          switch (error.response.status) {
            case 400: {
              this.$q.notify({
                color: 'negative',
                message: error.response.data.message,
                icon: 'report_problem'
              })
              break
            }
            default: {
              this.$q.notify({
                color: 'negative',
                position: 'top',
                message: 'Eroare :(',
                icon: 'report_problem'
              })
            }
          }
        })
    }
  },
  computed: {
    professors() {
      return this.$store.getters['data/getProfessors']
    },
    professor() {
      return this.$store.getters['data/getProfessor']
    }
  }
}
</script>

<style>
.content {
  width: 100vw;
  height: 100vw;
}

.q-scroll-area-coord {
  display: flex;
  flex-grow: 2;
}
</style>

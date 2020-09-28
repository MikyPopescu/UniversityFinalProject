<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#95c1e6, #2e618c);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:420px;height:610px;">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">Inregistrare</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl q-pb-lg">
              <q-input square clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input square clearable v-model="lastName" type="text" label="Nume">
                <template v-slot:prepend></template>
              </q-input>
              <q-input square clearable v-model="firstName" type="text" label="Prenume">
                <template v-slot:prepend></template>
              </q-input>

              <q-input
                square
                clearable
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                label="Parola"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-select v-model="type" :options="options" label="Tip Cont" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="primary"
              class="full-width text-white"
              label="CREARE CONT"
              @click="createAccount"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <p style="cursor:pointer" class="text-grey-6" @click="toLogin">Inapoi la autentificare</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      isPwd: true,
      email: '',
      lastName: '',
      firstName: '',
      password: '',
      type: '',
      options: [
        {
          label: 'Student',
          value: 'student'
        },
        {
          label: 'Profesor',
          value: 'professor'
        }
      ]
    }
  },
  methods: {
    createAccount: function() {
      //validam campurile
      let isValid = true
      //mail
      if (!this.email) {
        isValid = false
        this.$q.notify({
          type: 'negative',
          message: `Email lipsa`
        })
      } else {
        //mail prea scurt
        if (this.email.length <= 10) {
          isValid = false
          this.$q.notify({
            type: 'warning',
            message: `Prea putine caractere pentru un email!`
          })
        }
        //verifica exista @
        if (this.email.indexOf('@') == -1) {
          isValid = false
          this.$q.notify({
            type: 'warning',
            message: `Nu exista caracterul '@'!`
          })
        }
        //verifica exista '.'
        if (this.email.indexOf('.') == -1) {
          isValid = false
          this.$q.notify({
            type: 'warning',
            message: `Nu exista caracterul '.'!`
          })
        }
      }
      if (!this.lastName) {
        isValid = false
        this.$q.notify({
          type: 'negative',
          message: `Nume lipsa`
        })
      } else {
        if (
          this.lastName.includes('0') ||
          this.lastName.includes('1') ||
          this.lastName.includes('2') ||
          this.lastName.includes('3') ||
          this.lastName.includes('4') ||
          this.lastName.includes('5') ||
          this.lastName.includes('6') ||
          this.lastName.includes('7') ||
          this.lastName.includes('8') ||
          this.lastName.includes('9')
        ) {
          isValid = false
          this.$q.notify({
            type: 'negative',
            message: `Numele nu trebuie să conțină cifre`
          })
        }
      }
      if (!this.firstName) {
        isValid = false
        this.$q.notify({
          type: 'negative',
          message: `Completați câmpul "Prenume"`
        })
      } else {
        if (
          this.firstName.includes('0') ||
          this.firstName.includes('1') ||
          this.firstName.includes('2') ||
          this.firstName.includes('3') ||
          this.firstName.includes('4') ||
          this.firstName.includes('5') ||
          this.firstName.includes('6') ||
          this.firstName.includes('7') ||
          this.firstName.includes('8') ||
          this.firstName.includes('9')
        ) {
          isValid = false
          this.$q.notify({
            type: 'negative',
            message: `Prenumele nu poate contine cifre`
          })
        }
      }
      if (!this.password) {
        isValid = false
        this.$q.notify({
          type: 'negative',
          message: `Parola lipsa`
        })
      }
      //daca totul e ok facem requestul de register
      this.$axios
        .post('/api/auth/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          type: this.type.value,
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log(response.data)
          this.$q.notify({
            type: 'positive',
            message: `Felicitari`
          })
          this.$router.push({ name: 'Login' })
        })
        .catch(error => {
          console.log(error.response.data)
          switch (error.response.status) {
            case 401: {
              this.$q.notify({
                color: 'negative',
                position: 'top',
                message: error.response.data.message,
                icon: 'report_problem'
              })
              break
            }
            case 400: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: 'negative',
                  position: 'top',
                  message: element,
                  icon: 'report_problem'
                })
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
    },
    toLogin: function() {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#95c1e6, #2e618c);"
  >
    <!-- tabel -->
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Bine ati venit!</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                square
                filled
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
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width"
              @click="loginUser"
              label="Autentificare"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Nu ai cont?
              <strong
                style="cursor:pointer"
                clickable
                @click="toRegister"
              >Inregistreaza-te</strong>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'Login',
  data() {
    return {
      isPwd: true,
      email: '',
      password: ''
    }
  },

  methods: {
    loginUser: function() {
      //validez
      let isValid = true
      if (!this.email) {
        isValid = false
        this.$q.notify({
          type: 'negative',
          message: `Email lipsa`
        })
      }
      if (!this.password) {
        isValid = false
        this.$q.notify({
          type: 'negative',
          message: `Parola lipsa`
        })
      }
      //backend login
      this.$axios
        .post('/api/auth/login', {
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log(response.data)
          // this.$q.notify({
          //   type: 'positive',
          //   message: `Felicitari!`
          // })

          ///salvez info
          this.$q.localStorage.set('user', response.data)
          this.$router.push({ name: 'Home' })
        })

        .catch(error => {
          console.log(error.response.data)
          this.$q.notify({
            type: 'warning',
            message: `Reintroduceți informațiile`
          })
        })
    },
    toRegister: function() {
      this.$router.push({ name: 'Register' })
    }
  }
}
</script>

<style>
.strong {
  cursor: pointer;
}
.q-card {
  width: 430px;
}
</style>

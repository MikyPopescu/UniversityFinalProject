<template>
  <q-page padding>
    <div class="q-col-gutter-xs q-ma-md">
      <!-- <q-input color="primary" readonly borderless v-model="text" label="Profil" /> -->

      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12 column">
        <!-- Field List -->
        <q-list bordered separator>
          <!-- Last Name -->
          <q-item clickable v-ripple>
            <q-item-section class="col-2">Nume:</q-item-section>
            <q-item-section class="col-10">{{ user.lastName }}</q-item-section>
          </q-item>

          <!-- First Name -->
          <q-item clickable v-ripple>
            <q-item-section class="col-2">Prenume:</q-item-section>
            <q-item-section class="col-10">{{ user.firstName }}</q-item-section>
          </q-item>

          <!-- Email -->
          <q-item clickable v-ripple>
            <q-item-section class="col-2">Email:</q-item-section>
            <q-item-section class="col-10">{{ user.email }}</q-item-section>
          </q-item>

          <!-- Specialization - student only -->
          <q-item v-if="!isProfessor" clickable v-ripple>
            <q-item-section class="col-2">Specializare:</q-item-section>
            <q-item-section class="col-10">
              {{
              user.specialization
              }}
            </q-item-section>
          </q-item>

          <!-- Promotion - student only -->
          <q-item v-if="!isProfessor" clickable v-ripple>
            <q-item-section class="col-2">An inscriere:</q-item-section>
            <q-item-section class="col-10">{{ user.promotion }}</q-item-section>
          </q-item>

          <!-- Type of Professor - professor only -->
          <q-item v-if="isProfessor" clickable v-ripple>
            <q-item-section class="col-2">Grad didactic:</q-item-section>
            <q-item-section class="col-10">{{ user.academicTitle }}</q-item-section>
          </q-item>
        </q-list>

        <!-- Settings btn -->
        <q-btn
          color="primary"
          icon="fas fa-cogs"
          label="Setari"
          @click="
            userEdit = false;
            profile = true;
          "
        />
      </div>
    </div>

    <!---Edit Profile Dialog---->
    <q-dialog v-model="profile" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" style="width: 83%;">Profilul meu</div>
          <!---Edit button--->
          <div class="col-2" align="right">
            <q-btn
              color="primary"
              round
              outline
              icon="create"
              v-if="!userEdit"
              @click="
                userEdit = true;
                isPassword = false;
              "
            />
            <q-btn
              color="primary"
              round
              outline
              v-else
              icon="clear"
              @click="
                userEdit = false;
                isPassword = false;
              "
            />
          </div>
        </q-card-section>

        <!-- Fields -->
        <q-card-section>
          <!-- Last Name Field -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Nume:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.lastName }}</div>
            <q-input
              v-else
              class="col-9"
              type="text"
              outlined
              v-model="user.lastName"
              dense
              label="Nume"
            />
          </div>
          <!-- First Name Field -->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Prenume:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.firstName }}</div>
            <q-input
              v-else
              class="col-9"
              type="text"
              outlined
              v-model="user.firstName"
              dense
              label="Prenume"
            />
          </div>
          <!---Email Field--->
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Email:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.email }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.email"
              dense
              label="Email"
            />
          </div>

          <!-- Specialization Field -->
          <div v-if="!isProfessor" class="row q-mb-md">
            <div class="col-3 text-grey">Specializare:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.specialization }}</div>
            <q-select
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.specialization"
              :options="['Cibernetica Economica','Informatica Economica','Informatica Economica (Engleza)']"
              dense
              label="Specializare"
            />
          </div>

          <!---Promotion Field--->
          <div v-if="!isProfessor" class="row q-mb-md">
            <div class="col-3 text-grey">An inscriere:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.promotion }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.promotion"
              dense
              label="An insciere"
            />
          </div>

          <!---academic title Field--->
          <div v-if="isProfessor" class="row q-mb-md">
            <div class="col-3 text-grey">Grad didactic:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.academicTitle }}</div>

            <q-select
              v-if="userEdit"
              class="col-9"
              v-model="user.academicTitle"
              :options="['asist. univ. dr.', 'lect. univ .dr. ', 'conf. univ .dr. ', 'prof. univ .dr. ']"
              label="Grad Didactic"
              outlined
              dense
            />
          </div>

          <div class="row q-mb-md" v-if="isPassword">
            <div class="col-3 text-grey">Parola noua:</div>

            <q-input
              v-model="password"
              outlined
              label="Parola noua"
              class="col-9"
              dense
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions v-if="userEdit" align="around">
            <q-btn
              outline
              v-if="!isPassword"
              color="primary"
              @click="isPassword = true"
            >Schimba Parola</q-btn>
            <q-btn icon="clear" outline color="primary" v-else @click="isPassword = false">Parola</q-btn>
            <q-btn
              icon="save"
              outline
              color="primary"
              @click="executeSaveUser"
            >Salveaza modificarile</q-btn>
          </q-card-actions>
          <q-card-actions v-else align="around">
            <q-btn outline color="negative" @click="deleteAccount()">Sterge cont</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  beforeMount() {
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
      profile: false,
      userEdit: false,
      isPwd: true,
      isPassword: false,
      profile: false,
      state: 'VIEW',
      user: {},
      card: false
    }
  },

  methods: {
    deleteAccount(user) {
      this.$q
        .dialog({
          title: 'Stergere cont',
          message: `Sunteti sigur ca ddoriti sa stergeti contul?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete('/api/auth/delete')
            .then(response => {
              this.$q.notify({
                color: 'green',
                message: response.data.message,
                icon: 'check'
              })
              this.$q.localStorage.set('user', false)
              this.$router.push('/auth/login')
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

    executeSaveUser() {
      this.$axios
        .put('/api/auth/edit', {
          ...this.user,
          ...this.userEdit,
          academicTitle: this.user.academicTitle,
          password: this.password,
          changePassword: this.isPassword
        })
        .then(response => {
          this.$q.notify({
            color: 'green',
            message: response.data.message,
            icon: 'check'
          })

          this.$q.localStorage.set('user', response.data.user)
          this.user = response.data.user
          this.userEdit = false
          this.isPassword = false
        })
        .catch(error => {
          console.log(error)
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
  }
}
</script>

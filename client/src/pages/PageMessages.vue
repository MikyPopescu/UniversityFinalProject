<template>
  <q-page class="flex column">
    <div class="q-pa-md column col jusitfy-end">
      <!-- <q-chat-message label="30 Aprilie 2020" /> -->
      <!-- <h5 style="text-align:center">{{new Date().toLocaleString().slice(0,10)}}</h5> -->
      <div class="absolute-left">
        <q-btn v-go-back.single color="primary" dense flat icon="arrow_back" label="Inapoi" />
      </div>
      <hr />
      <hr />

      <q-chat-message
        v-for="message in messages"
        :key="message.id"
        :text="[message.content]"
        :sent="message.sender == user.id ? true : false"
      />
    </div>
    <q-footer>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            v-model="newMessage"
            bg-color="white"
            outlined
            clearable
            rounded
            autogrow
            label="Trimite mesaj"
            dense
          >
            <template v-slot:after>
              <q-btn @click="sendMessage" round dense flat type="submit" color="white" icon="send" />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
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
    } else {
      this.$store.dispatch('data/loadMessages', this.idStudent)
    }
  },
  data() {
    return {
      idStudent: this.$route.params.id,
      newMessage: ''
    }
  },
  methods: {
    sendMessage() {
      this.$axios
        .post(`/api/profStuds/messages?id=${this.idStudent}`, {
          content: this.newMessage
        })
        .then(response => {
          this.$store.dispatch('data/loadMessages', this.idStudent)
        })
        .catch(error => {
          switch (error.response.status) {
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
    messages() {
      return this.$store.getters['data/getMessages']
    },
    studentId() {
      return this.$route.params.id
    }
  }
}
</script>

<style scoped>
.q-footer {
  display: block;
  padding-top: 10px;
}
</style>

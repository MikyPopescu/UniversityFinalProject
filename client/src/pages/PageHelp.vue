<template>
  <q-page padding>
    <div class="q-pa-md column col jusitfy-end">
      <!-- <q-input color="primary" readonly borderless v-model="text" label="Intrebari frecvente" /> -->
      <div style="q-pa-md absolute full-width full-height column"></div>
      <q-list bordered class="rounded-borders">
        <q-item-label header>Directii de elaborare</q-item-label>
        <q-expansion-item
          expand-separator
          icon="account_tree"
          label="Indicatii privind structura"
          caption="Se recomanda ca structura lucrarii de finalizare sa fie urmatoarea"
        >
          <q-card>
            <q-card-section>
              <ul>
                <li>Coperta interioara a lucrarii:</li>
                <li>Cuprins</li>
                <li>Introducere</li>
                <li>Suport teoretic</li>
                <li>Prezentarea partii aplicative</li>
                <li>Concluzii</li>
                <li>Referinte bibliografice</li>
                <li>Anexe(facultativ)</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="fas fa-edit"
          label="Norme de redactare"
          caption="Lucrarea, cu exceptia anexelor, trebuie sa contina"
        >
          <q-card>
            <q-card-section>
              <ul>
                <li>Maxim 40 de pagini in format A4, in cazul lucrarilor de licenta</li>
                <li>Respectiv 50 de pagini in cazul lucrarilor de disertatie</li>
                <li>Fontul ales Times New Roman, caractere de 12</li>
                <li>Lucrarile se vor scrie cu diacritice</li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <hr />
      <q-list bordered class="rounded-borders">
        <q-item-label header>Mai multe</q-item-label>
        <q-item @click="visitCSIE" tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Avizier</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <q-item @click="visitRegulament" tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Regulament</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'
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
  methods: {
    visitCSIE() {
      openURL('http://csie.ase.ro/avizier')
    },
    visitRegulament() {
      openURL(
        'http://csie.ase.ro/Media/Default/BlogPost/avizier/Regulament_finalizare_studii_2020.pdf'
      )
    }
  }
}
</script>
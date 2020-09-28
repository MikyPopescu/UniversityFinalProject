<template>
  <div class="q-pa-md">
    <q-parallax>
      <template v-slot:media>
        <!-- <h4>Coordonare:</h4> -->
      </template>
      <template>
        <img src="statics/dice.SVG" style="width: 750px; height: 480px" />
      </template>
    </q-parallax>

    <!-- <div v-if="isProfessor">
      <q-card class="bg-transparent no-shadow no-border">
        <q-card-section class="q-pa-none">
          <div class="row q-col-gutter-sm">
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item style="background-color: #4fbb91" class="q-pa-none q-ml-xs">
                <q-item-section
                  side
                  style="background-color: #419e7a"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="list" color="white" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">40</q-item-label>
                  <q-item-label>Tasks Added Today</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item style="background-color: #ee9835" class="q-pa-none q-ml-xs">
                <q-item-section
                  side
                  style="background-color: #d3862d"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="sync" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">50</q-item-label>
                  <q-item-label>Tasks In Progress Today</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item style="background-color: #8f64e3" class="q-pa-none q-ml-xs">
                <q-item-section
                  side
                  style="background-color: #6d46bb"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="compare_arrows" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">30</q-item-label>
                  <q-item-label>Tasks In Testing Today</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item style="background-color: #3d8117" class="q-pa-none q-ml-xs q-mr-xs">
                <q-item-section
                  side
                  style="background-color: #376a1a"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="las la-check-circle" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">80</q-item-label>
                  <q-item-label>Tasks Completed Today</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>-->

    <q-stepper
      v-if="!isProfessor"
      v-model="step"
      ref="stepper"
      alternative-labels
      color="primary"
      animated
    >
      <q-step :name="1" title="Selecteaza un coordonator" :done="step > 1">
        <strong>O lucrare de licenta reprezinta un proces de studiu</strong>
        <ul>
          <li>
            Solicitare
            <em>coordonator stiintific</em>;
          </li>
          <li>Ideea de baza a lucrarii trebuie dezbatuta cu profesorului coordonator;</li>
          <li>Coordonatorul poate solicita sectiuni din lucrare pentru a masura progresul studentului sau.</li>
        </ul>
      </q-step>

      <q-step
        :name="2"
        title="Implementare & tehnoredactare"
        icon="create_new_folder"
        :done="step > 2"
      >
        <strong>Scopul unei lucrari de licenta</strong>
        <ul>
          <li>Asimilarea si intelegerea notiunilor fundamentale specifice temei abordate in lucrare;</li>
          <li>Aptitudinea de a strange, cerceta si expune in mod ordonat, logic informatiile referitoare la bibliografia domeniului analizat;</li>
          <li>Contribuirea in mod autentic la extinderea domeniului analizat.</li>
        </ul>
      </q-step>

      <q-step :name="3" title="Prezentare" icon="add_comment">
        <strong>Prezentarea lucrarii de licenta</strong>
        <ul>
          <li>Masurarea coeficientului de similitudine</li>
          <li>Inscrierea in vederea sustinerii</li>
          <li>Prezentarea lucrarii in fata comisiei</li>
        </ul>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 3 ? 'Finalizare' : 'Inainte'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Inapoi"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
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
      step: 1
    }
  }
}
</script>

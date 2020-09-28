<template>
  <q-layout view="lHr lpr lFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!--Buton meniu stanga-->
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <!---Titlu-->
        <q-toolbar-title v-if=" isStudent" class="absolute-center">Student</q-toolbar-title>
        <q-toolbar-title v-if="isProfessor" class="absolute-center">Profesor</q-toolbar-title>
        <q-toolbar-title v-if=" isAdmin" class="absolute-center">Administrator</q-toolbar-title>

        <!--Butoane sus-->
        <div v-else class="absolute-right">
          <q-btn round dense flat icon="fas fa-sign-out-alt" to="/auth/login">
            <q-tooltip>Iesire</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!---Drawer Layout stanga--->
    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      :breakpoint="767"
      bordered
      content-class="bg-grey-1"
    >
      <q-scroll-area
        style="height: calc(100% - 144px); margin-top: 144px; border-right: 1px solid #ddd"
      >
        <!-----Optiuni nav student--------->
        <q-list v-if="isStudent" padding>
          <q-item-label header class="text-grey-8">Navigare</q-item-label>

          <q-item
            v-for="nav in studentNavs"
            :key="nav.label"
            :to="nav.to"
            class="text-primary"
            exact
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ nav.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <!-----Optiuni nav profesor--------->
        <q-list v-if="isProfessor" padding>
          <q-item-label header class="text-grey-8">Navigare</q-item-label>

          <q-item
            v-for="nav in profNavs"
            :key="nav.label"
            :to="nav.to"
            class="text-primary"
            exact
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ nav.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-------Optiuni nav administrator------->
        <q-list v-if="isAdmin" padding>
          <q-item-label header class="text-grey-8">Navigare</q-item-label>

          <q-item
            v-for="nav in adminNavs"
            :key="nav.label"
            :to="nav.to"
            class="text-primary"
            exact
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ nav.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="/statics/Logo.png" style="height: 170px">
        <div class="absolute-bottom bg-transparent"></div>
      </q-img>
    </q-drawer>

    <!-------Footer Student---------->
    <q-footer v-if="isStudent">
      <q-tabs>
        <q-route-tab
          v-for="nav in studentNavs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label"
          exact
          clickable
        />
      </q-tabs>
    </q-footer>

    <!-------Footer Profesor---------->
    <q-footer v-if="isProfessor">
      <q-tabs>
        <q-route-tab
          v-for="nav in profNavs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label"
          exact
          clickable
        />
      </q-tabs>
    </q-footer>

    <!-------Footer Admin---------->
    <q-footer v-if="isAdmin">
      <q-tabs>
        <q-route-tab
          v-for="nav in adminNavs"
          :key="nav.label"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label"
          exact
          clickable
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  beforeMount() {
    const user = this.$q.localStorage.getItem('user')
    this.isProfessor = user.type === 'professor'
    this.isStudent = !this.isProfessor

    if (this.isStudent) {
      this.$store.dispatch('data/loadProfessors')
    } else {
      this.$store.dispatch('data/loadStudents')
      this.$store.dispatch('data/loadAsignedStudents')
    }
  },

  data() {
    return {
      isAdmin: false,
      isStudent: false,
      isProfessor: false,

      left: false,

      studentNavs: [
        {
          label: 'Acasa',
          icon: 'fas fa-home',
          to: '/'
        },
        {
          label: 'Profil',
          icon: 'fas fa-user',
          to: '/profile'
        },

        {
          label: 'Coordonator',
          icon: 'fas fa-graduation-cap',
          to: '/coordinator'
        },
        {
          label: 'Calendar',
          icon: 'fas fa-calendar',
          to: '/calendar'
        },
        {
          label: 'Ajutor',
          icon: 'help',
          to: '/help'
        }
      ],
      profNavs: [
        {
          label: 'Acasa',
          icon: 'fas fa-home',
          to: '/'
        },
        {
          label: 'Profil',
          icon: 'fas fa-user',
          to: '/profile'
        },

        {
          label: 'Studenti',
          icon: 'fas fa-users',
          to: '/students'
        },
        {
          label: 'Calendar',
          icon: 'fas fa-calendar',
          to: '/calendar'
        },
        {
          label: 'Ajutor',
          icon: 'help',
          to: '/help'
        }
      ],
      adminNavs: [
        {
          label: 'Rapoarte',
          icon: 'assessment'
          // to: '/profile'
        },
        {
          label: 'Calendar',
          icon: 'event'
          // to: '/calendar'
        },
        {
          label: 'Vezi alocari',
          icon: 'list'
          // to: '/profile'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}
</style>

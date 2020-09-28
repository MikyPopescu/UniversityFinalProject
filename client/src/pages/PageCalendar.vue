<template>
  <q-page>
    <div>
      <h3 style="text-align:center">Calendarul Activitatilor</h3>
      <h6 style="text-align:center">Octombrie 2019 - Septembrie 2020</h6>
      <div></div>
      <q-btn
        unelevated
        color="primary"
        size="lg"
        class="full-width"
        outline
        label="Consultati calendarul studentului"
        @click="toPDF"
      />
      <br />
      <q-toolbar>
        <q-btn size="md" color="primary" @click="calendarPrev">
          <q-icon left name="fas fa-arrow-left" />
          <div>Inapoi</div>
        </q-btn>
        <!-- <q-separator vertical /> -->
        <hr />
        <q-btn size="md" color="primary" icon-right="fas fa-arrow-right" @click="calendarNext">
          <div>Inainte &nbsp;&nbsp;</div>
        </q-btn>
      </q-toolbar>
      <q-separator />

      <div style="overflow: hidden;">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="month"
          locale="ro"
          animated
          :day-height="130"
          transition-prev="slide-right"
          transition-next="slide-left"
          :selected-dates="selectedDates"
          @click:day="onToggleDate"
          @click:date="onToggleDate"
        >
          <template #week="{ week, weekdays, miniMode }">
            <template v-if="!miniMode">
              <template v-for="(computedEvent, index) in getWeekEvents(week, weekdays)">
                <q-badge
                  :key="index"
                  class="q-row-event"
                  :class="badgeClasses(computedEvent, 'day')"
                  :style="badgeStyles(computedEvent, 'day', week.length)"
                >
                  <template v-if="computedEvent.event">
                    <q-icon :name="computedEvent.event.icon" class="q-mr-xs"></q-icon>
                    <span class="ellipsis">
                      {{
                      computedEvent.event.title
                      }}
                    </span>
                  </template>
                </q-badge>
              </template>
            </template>
          </template>
        </q-calendar>
      </div>
    </div>
  </q-page>
</template>
<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'

const CURRENT_DAY = new Date(2019, 9, 1) //1 octombrie 2019

function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = QCalendar.parseDate(newDay)
  return tm.date
}

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
      selectedDate: '',
      selectedDates: [],
      events: [
        {
          title: 'Deschidere an universitar ',
          color: 'teal',
          start: getCurrentDay(0),
          end: getCurrentDay(0),
          icon: 'fas fa-door-open'
        },
        {
          title:
            'Alegerea temei de licenta si stabilirea coordonatorului stiintific la secretariatul facultatii',
          color: 'primary',
          start: getCurrentDay(0),
          end: getCurrentDay(31),
          icon: 'fas fa-file'
        },
        {
          title:
            'Incarcarea pe pagina web a lucrarii de licenta - verificare antiplagiat - sesiunea iulie',
          color: 'secondary',
          start: getCurrentDay(266),
          end: getCurrentDay(270),
          icon: 'fas fa-file-upload'
        },
        {
          title:
            'Acordare calificativ Admis/Respins pentru lucrarile de licenta depuse - sesiunea iulie',
          color: 'primary',
          start: getCurrentDay(273),
          end: getCurrentDay(276),
          icon: 'fas fa-check-square'
        },
        {
          title:
            'Inscrieri pentru sustinerea examenului de licenta - sesiunea iulie',
          color: 'secondary',
          start: getCurrentDay(280),
          end: getCurrentDay(282),
          icon: 'fas fa-signature'
        },
        {
          title: 'Sustinerea examenului de licenta - sesiunea iulie ',
          color: 'primary',
          start: getCurrentDay(287),
          end: getCurrentDay(290),
          icon: 'fas fa-file-powerpoint'
        },
        {
          title: 'Incarcarea pe pagina web',
          color: 'primary',
          start: getCurrentDay(337),
          end: getCurrentDay(337),
          icon: 'fas fa-file-upload'
        },
        {
          title: 'a lucrarii de licenta ',
          color: 'primary',
          start: getCurrentDay(337),
          end: getCurrentDay(337)
        },
        {
          title: '- verificare antiplagiat - ',
          color: 'primary',
          start: getCurrentDay(337),
          end: getCurrentDay(337)
        },
        {
          title: ' sesiunea septembrie ',
          color: 'primary',
          start: getCurrentDay(337),
          end: getCurrentDay(337)
        },
        {
          title:
            'Acordare calificativ Admis/Respins pentru lucrarile de licenta',
          color: 'secondary',
          start: getCurrentDay(338),
          end: getCurrentDay(339),
          icon: 'fas fa-check-square'
        },
        {
          title: '  depuse - sesiunea septembrie',
          color: 'secondary',
          start: getCurrentDay(338),
          end: getCurrentDay(339)
        },

        {
          title: 'Inscrieri pentru sustinerea examenului de licenta ',
          color: 'primary',
          start: getCurrentDay(340),
          end: getCurrentDay(341),
          icon: 'fas fa-signature'
        },
        {
          title: '- sesiunea septembrie ',
          color: 'primary',
          start: getCurrentDay(340),
          end: getCurrentDay(341)
        },

        {
          title: 'Sustinerea examenului de licenta - sesiunea septembrie ',
          color: 'secondary',
          start: getCurrentDay(343),
          end: getCurrentDay(344),
          icon: 'fas fa-file-powerpoint'
        }
      ]
    }
  },

  methods: {
    toPDF: function() {
      this.$router.push({ name: 'PDF' })
    },
    calendarNext() {
      this.$refs.calendar.next()
    },

    calendarPrev() {
      this.$refs.calendar.prev()
    },

    onToggleDate(timestamp) {
      if (this.selectedDates.includes(timestamp.date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (timestamp.date === this.selectedDates[i]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      } else {
        // add the date
        this.selectedDates.push(timestamp.date)
      }
    },
    isCssColor(color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },
    badgeClasses(infoEvent, type) {
      const color =
        infoEvent.event !== void 0 ? infoEvent.event.color : 'transparent'
      const cssColor = this.isCssColor(color)
      const isHeader = type === 'header'

      return {
        [`text-white bg-${color}`]: !cssColor,
        'full-width':
          !isHeader && (!infoEvent.side || infoEvent.side === 'full'),
        'left-side': !isHeader && infoEvent.side === 'left',
        'right-side': !isHeader && infoEvent.side === 'right',
        'cursor-pointer': infoEvent.event !== void 0,
        'event-void': infoEvent.event === void 0 // height: 0, padding: 0
      }
    },

    badgeStyles(infoEvent, type, weekLength, timeStartPos, timeDurationHeight) {
      const s = {}
      if (timeStartPos) {
        s.top = timeStartPos(infoEvent.event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(infoEvent.event.duration) + 'px'
      }
      if (infoEvent.size !== void 0) {
        s.width = (100 / weekLength) * infoEvent.size + '% !important'
      }
      // s['align-items'] = 'flex-start'
      return s
    },

    getWeekEvents(week, weekdays) {
      const tsFirstDay = QCalendar.parsed(week[0].date + ' 00:00')
      const tsLastDay = QCalendar.parsed(week[week.length - 1].date + ' 23:59')

      const firstDay = QCalendar.getDayIdentifier(tsFirstDay)
      const lastDay = QCalendar.getDayIdentifier(tsLastDay)

      const eventsWeek = []
      this.events.forEach((event, id) => {
        const tsStartDate = QCalendar.parsed(event.start + ' 00:00')
        const tsEndDate = QCalendar.parsed(event.end + ' 23:59')
        const startDate = QCalendar.getDayIdentifier(tsStartDate)
        const endDate = QCalendar.getDayIdentifier(tsEndDate)

        if (this.isBetweenDatesWeek(startDate, endDate, firstDay, lastDay)) {
          const left = QCalendar.daysBetween(tsFirstDay, tsStartDate, true)
          const right = QCalendar.daysBetween(tsEndDate, tsLastDay, true)

          eventsWeek.push({
            id, // index event
            left, // Position initial day [0-6]
            right, // Number days available
            size: week.length - (left + right), // Size current event (in days)
            event // Info
          })
        }
      })

      const events = []
      if (eventsWeek.length > 0) {
        const infoWeek = eventsWeek.sort((a, b) => a.left - b.left)
        infoWeek.forEach((event, i) => {
          this.insertEvent(events, week.length, infoWeek, i, 0, 0)
        })
      }

      return events
    },
    insertEvent(events, weekLength, infoWeek, index, availableDays, level) {
      const iEvent = infoWeek[index]
      if (iEvent !== void 0 && iEvent.left >= availableDays) {
        // If you have space available, more events are placed
        if (iEvent.left - availableDays) {
          // It is filled with empty events
          events.push({ size: iEvent.left - availableDays })
        }
        // The event is built
        events.push({ size: iEvent.size, event: iEvent.event })

        if (level !== 0) {
          // If it goes into recursion, then the item is deleted
          infoWeek.splice(index, 1)
        }

        const currentAvailableDays = iEvent.left + iEvent.size

        if (currentAvailableDays < weekLength) {
          const indexNextEvent = QCalendar.indexOf(
            infoWeek,
            e => e.id !== iEvent.id && e.left >= currentAvailableDays
          )

          this.insertEvent(
            events,
            weekLength,
            infoWeek,
            indexNextEvent !== -1 ? indexNextEvent : index,
            currentAvailableDays,
            level + 1
          )
        } // else: There are no more days available, end of iteration
      } else {
        events.push({ size: weekLength - availableDays })
        // end of iteration
      }
    },
    isBetweenDates(date, start, end) {
      return date >= start && date <= end
    },

    isBetweenDatesWeek(dateStart, dateEnd, weekStart, weekEnd) {
      return (
        (dateEnd < weekEnd && dateEnd >= weekStart) ||
        dateEnd === weekEnd ||
        (dateEnd > weekEnd && dateStart <= weekEnd)
      )
    }
  }
}
</script>

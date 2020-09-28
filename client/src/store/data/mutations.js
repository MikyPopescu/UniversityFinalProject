// export function someMutation(/* state */) {}

export function SET_STUDENTS(state, payload) {
  state.students = payload;
}

export function SET_PROFESSOR(state, payload) {
  state.professor = payload;
}

export function SET_ASIGNED_STUDENTS(state, payload) {
  state.asignedStudents = payload;
}

export function SET_PENDING_STUDENTS(state, payload) {
  state.pendingStudents = payload;
}
export function SET_PROFESSORS(state, payload) {
  state.professors = payload;
}
export function SET_TASKS(state, payload) {
  state.tasks = payload;
}

export function SET_MEETINGS(state, payload) {
  state.meetings = payload;
}

export function SET_ALL_MEETINGS(state, payload) {
  state.allMeetings = payload;
}

export function SET_CHANGES(state, payload) {
  state.changes = payload;
}

export function SET_MESSAGES(state, payload) {
  state.messages = payload;
}

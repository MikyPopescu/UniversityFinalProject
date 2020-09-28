// export function someGetter(/*  state */) {}

export function getStudents(state) {
  return state.students;
}
export function getAsignedStudents(state) {
  return state.asignedStudents;
}

export function getProfessor(state) {
  return state.professor;
}

export function getPendingStudents(state) {
  return state.pendingStudents;
}
export function getProfessors(state) {
  return state.professors;
}

export function getTasks(state) {
  return state.tasks;
}

export function getMessages(state) {
  return state.messages;
}

export function getMeetings(state) {
  return state.meetings;
}

export function getAllMeetings(state) {
  return state.allMeetings;
}

export function getChanges(state) {
  return state.changes;
}

// export function someAction(/* context */) {}
import Axios from "axios";

export async function loadStudents({ commit }) {
  const response = await Axios.get("/api/profStuds/students");
  commit("SET_STUDENTS", response.data);
}

export async function loadMessages({ commit }, id) {
  console.log("id=", id);
  const response = await Axios.get(`/api/profStuds/messages?id=${id}`);
  commit("SET_MESSAGES", response.data);
}

export async function loadProfessor({ commit }) {
  const response = await Axios.get("/api/profStuds/professor");
  commit("SET_PROFESSOR", response.data);
}

export async function loadAsignedStudents({ commit }) {
  const response = await Axios.get("/api/profStuds/assignedstudents");
  commit("SET_ASIGNED_STUDENTS", response.data);
}

export async function loadPendingStudents({ commit }) {
  const response = await Axios.get("/api/profStuds/pendingstudents");
  commit("SET_PENDING_STUDENTS", response.data);
}

export async function loadProfessors({ commit }) {
  const response = await Axios.get("/api/profStuds/professors");
  commit("SET_PROFESSORS", response.data);
}

export async function loadTasksForOneUser({ commit }, id) {
  const response = await Axios.get(`/api/profStuds/tasks/?id=${id}`);
  commit("SET_TASKS", response.data);
}

export async function loadMeetingsForOneUser({ commit }, id) {
  //console.log(id);
  const response = await Axios.get(`/api/profStuds/meetings/?id=${id}`);
  commit("SET_MEETINGS", response.data);
}

export async function loadChangesForOneUser({ commit }, id) {
  const response = await Axios.get(`/api/profStuds/changes/?id=${id}`);
  commit("SET_CHANGES", response.data);
}

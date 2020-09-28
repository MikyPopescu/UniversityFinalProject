const express = require('express');
const router = express.Router();

const {
  profStuds,
  changes,
  tasks,
  messages,
  meetings,
  profStudsData,
} = require('../controllers');
const { request } = require('express');

router.get('/assignedstudents', profStuds.getAssignedStudents);
router.get('/professors', profStuds.getProfessors);
router.get('/professor', profStuds.getProfessor);
router.get('/students', profStuds.getStudents);
router.get('/pendingstudents', profStuds.getPendingStudents);
router.post('/', profStuds.addEntity);
router.post('/students', profStuds.approveStudent);
router.post('/student', profStuds.rejectStudent);

router.get('/changes', changes.getChanges);
router.post('/changes', changes.createChange);

router.get('/tasks', tasks.getTasks);
router.post('/tasks', tasks.createTask);
router.put('/tasks/:id', tasks.updateTask);
router.delete('/tasks/:id', tasks.deleteTask);

router.post('/messages', messages.sendMessage);
router.get('/messages', messages.getMessages);

router.get('/meetings', meetings.getMeetings);
router.post('/meetings', meetings.createMeeting);
router.put('/meetings/:id', meetings.updateMeeting);
router.delete('/meetings/:id', meetings.deleteMeeting);
module.exports = router;

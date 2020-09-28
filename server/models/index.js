const { sequelize } = require('../config');

//importing tables from models
const User = sequelize.import('./user');
const ProfessorStudent = sequelize.import('./professorStudent');
const ProfessorData = sequelize.import('./professorData');
const StudentData = sequelize.import('./studentData');
const Meeting = sequelize.import('./meeting');
const Question = sequelize.import('./question');
const Answer = sequelize.import('./answer');
const ChangeOnRequestPaper = sequelize.import('./changeOnRequestPaper');
const Message = sequelize.import('./message');
const Task = sequelize.import('./task');

//FK:
User.hasMany(ProfessorStudent, { onDelete: 'Cascade' });
User.hasOne(StudentData, { onDelete: 'Cascade' });
User.hasOne(ProfessorData, { onDelete: 'Cascade' });
User.hasMany(Question, { onDelete: 'Cascade' });
User.hasMany(Answer, { onDelete: 'Cascade' });

ProfessorStudent.hasMany(Meeting, { onDelete: 'Cascade' });
ProfessorStudent.hasMany(Message, { onDelete: 'Cascade' });
ProfessorStudent.hasMany(Task, { onDelete: 'Cascade' });
ProfessorStudent.hasMany(ChangeOnRequestPaper, { onDelete: 'Cascade' });

Question.hasMany(Answer, { onDelete: 'Cascade' });

module.exports = {
  User,
  ProfessorStudent,
  ProfessorData,
  StudentData,
  Meeting,
  Question,
  Answer,
  ChangeOnRequestPaper,
  Message,
  Task,
  sequelize,
};

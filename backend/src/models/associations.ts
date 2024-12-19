import User from "./user.js";
import Project from "./project.js";
import Task from "./task.js";
import Message from "./messages.js";
import Subtask from "./subTask.js";
import UserProjectRoles from "./user_project_roles.js";
import Semester from "./semester.js";
import UploadSetting from "./uploadSetting.js";

const defineAssociations = () => {
  User.hasMany(Task, { foreignKey: "assigned_to", onDelete: "CASCADE" });
  Task.belongsTo(User, { foreignKey: "assigned_to" });

  Project.hasMany(Task, { foreignKey: "project_id", onDelete: "CASCADE" });
  Task.belongsTo(Project, { foreignKey: "project_id" });

  User.hasMany(Message, { foreignKey: "user_id", onDelete: "CASCADE" });
  Message.belongsTo(User, { foreignKey: "user_id" });

  // Tasks and Subtasks
  Task.hasMany(Subtask, { foreignKey: "task_id", onDelete: "CASCADE" });
  Subtask.belongsTo(Task, { foreignKey: "task_id" });

  User.hasMany(Subtask, { foreignKey: "assigned_to", onDelete: "CASCADE" });
  Subtask.belongsTo(User, { foreignKey: "assigned_to" });

  // Projects and Students
  Project.belongsToMany(User, {
    through: UserProjectRoles,
    foreignKey: "project_id",
    onDelete: "CASCADE",
  });
  User.belongsToMany(Project, {
    through: UserProjectRoles,
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  UserProjectRoles.belongsTo(User, { foreignKey: "user_id" });
  UserProjectRoles.belongsTo(Project, { foreignKey: "project_id" });

  Semester.hasMany(Project, { foreignKey: "semester_id", onDelete: "CASCADE" });
  Project.belongsTo(Semester, { foreignKey: "semester_id" });

  Semester.hasMany(UploadSetting, {
    foreignKey: "semester_id",
    onDelete: "CASCADE",
  });
  UploadSetting.belongsTo(Semester, { foreignKey: "semester_id" });
};

export default defineAssociations;

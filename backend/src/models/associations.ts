import User from "./user.js";
import Student from "./student.js";
import Supervisor from "./supervisor.js";
import Project from "./project.js";
import Task from "./task.js";
import Comment from "./comment.js";
import Post from "./posts.js";
import Message from "./messages.js";
import Subtask from "./subTask.js";
import Follower from "./followers.js";
import Mentorship from "./mentorships.js";

const defineAssociations = () => {
  // User has many Students and Supervisors
  User.hasMany(Student, { foreignKey: "user_id", onDelete: "CASCADE" });
  Student.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Supervisor, { foreignKey: "user_id", onDelete: "CASCADE" });
  Supervisor.belongsTo(User, { foreignKey: "user_id" });

  // User has many Projects, Tasks, Comments, Posts, Messages
  User.hasMany(Project, { foreignKey: "user_id", onDelete: "CASCADE" });
  Project.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Task, { foreignKey: "user_id", onDelete: "CASCADE" });
  Task.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
  Comment.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE" });
  Post.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Message, { foreignKey: "user_id", onDelete: "CASCADE" });
  Message.belongsTo(User, { foreignKey: "user_id" });

  // Tasks and Subtasks
  Task.hasMany(Subtask, { foreignKey: "task_id", onDelete: "CASCADE" });
  Subtask.belongsTo(Task, { foreignKey: "task_id" });

  // Projects and Students
  Project.belongsToMany(Student, {
    through: "ProjectStudent",
    foreignKey: "project_id",
    onDelete: "CASCADE",
  });
  Student.belongsToMany(Project, {
    through: "ProjectStudent",
    foreignKey: "student_id",
  });

  // Projects and Supervisors
  Project.belongsToMany(Supervisor, {
    through: "ProjectSupervisor",
    foreignKey: "project_id",
    onDelete: "CASCADE",
  });
  Supervisor.belongsToMany(Project, {
    through: "ProjectSupervisor",
    foreignKey: "supervisor_id",
  });

  // Mentorship and Followers
  User.hasMany(Follower, {
    foreignKey: "follower_id",
    onDelete: "CASCADE",
  });
  Follower.belongsTo(User, { foreignKey: "user_id" });

  // Optional relationship between Mentorship and Project
  // Mentorship.belongsTo(Project, {
  //   foreignKey: "project_id",
  //   onDelete: "SET NULL",
  // });
  // Project.hasMany(Mentorship, {
  //   foreignKey: "project_id",
  //   onDelete: "SET NULL",
  // });
};

export default defineAssociations;

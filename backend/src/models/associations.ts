import User from "./user.js";
import Project from "./project.js";
import Task from "./task.js";
import Comment from "./comment.js";
import Post from "./posts.js";
import Message from "./messages.js";
import Subtask from "./subTask.js";
import Follower from "./followers.js";
import UserProjectRoles from "./User_Project_Roles.js";

const defineAssociations = () => {
  User.hasMany(Task, { foreignKey: "assigned_to", onDelete: "CASCADE" });
  Task.belongsTo(User, { foreignKey: "assigned_to" });

  Project.hasMany(Task, { foreignKey: "project_id", onDelete: "CASCADE" });
  Task.belongsTo(Project, { foreignKey: "project_id" });

  User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
  Comment.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE" });
  Post.belongsTo(User, { foreignKey: "user_id" });

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

  // Mentorship and Followers
  User.hasMany(Follower, {
    foreignKey: "follower_id",
    onDelete: "CASCADE",
  });
  Follower.belongsTo(User, { foreignKey: "user_id" });
};

export default defineAssociations;

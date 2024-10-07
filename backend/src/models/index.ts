import User from "./user.js";
import Project from "./project.js";
import Task from "./task.js";
import Comment from "./comment.js";
import Subtask from "./subTask.js";

// User.hasMany(Project, { foreignKey: "supervisor_id" });
// Project.belongsTo(User, { foreignKey: "supervisor_id" });

// User.hasMany(Task, { foreignKey: "assigned_to" });
// Task.belongsTo(User, { foreignKey: "assigned_to" });

// Project.hasMany(Task, { foreignKey: "project_id" });
// Task.belongsTo(Project, { foreignKey: "project_id" });

// Task.hasMany(Subtask, { foreignKey: "task_id" });
// Subtask.belongsTo(Task, { foreignKey: "task_id" });

// Task.hasMany(Comment, { foreignKey: "task_id" });
// Comment.belongsTo(Task, { foreignKey: "task_id" });

export { User, Project, Task, Comment, Subtask };

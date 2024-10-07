import {
  Model,
  Column,
  Table,
  DataType,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Project, Subtask, User, Comment } from "./index.js";

@Table({ tableName: "tasks" })
class Task extends Model<Task> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  project_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({
    type: DataType.ENUM("to do", "in progress", "done"),
    allowNull: false,
  })
  status!: "to do" | "in progress" | "done";

  @Column({ type: DataType.ENUM("low", "medium", "high"), allowNull: false })
  priority!: "low" | "medium" | "high";

  @Column({ type: DataType.INTEGER, allowNull: true })
  assigned_to?: number;

  @Column({ type: DataType.DATE, allowNull: true })
  due_date?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;

  @BelongsTo(() => User, { foreignKey: "assigned_to" })
  assignedUser!: User;

  @BelongsTo(() => Project, { foreignKey: "project_id" })
  project!: Project;

  @HasMany(() => Subtask, { foreignKey: "task_id" })
  subtasks!: Subtask[];

  @HasMany(() => Comment, { foreignKey: "task_id" })
  comments!: Comment[];
}

export default Task;

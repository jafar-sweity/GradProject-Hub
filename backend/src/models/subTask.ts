import {
  Model,
  Column,
  Table,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import { Task } from "./index.js";

@Table({ tableName: "subtasks" })
class Subtask extends Model<Subtask> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  task_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({
    type: DataType.ENUM("to do", "in progress", "done"),
    allowNull: false,
  })
  status!: "to do" | "in progress" | "done";

  @Column({ type: DataType.DATE, allowNull: true })
  due_date?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;

  @BelongsTo(() => Task, { foreignKey: "task_id" })
  task!: Task;
}

export default Subtask;

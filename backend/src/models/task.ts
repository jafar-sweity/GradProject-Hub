import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Project from "./project.js";
import User from "./user.js";

@Table
class Task extends Model<Task> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  task_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({
    type: DataType.ENUM("Pending", "In Progress", "Completed"),
    allowNull: false,
  })
  status!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  due_date!: Date;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  project_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  assigned_to!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Task;

import {
  Model,
  Column,
  Table,
  DataType,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Task, User } from "./index.js";

@Table({ tableName: "projects" })
class Project extends Model<Project> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({
    type: DataType.ENUM("ongoing", "completed", "pending", "cancelled"),
    allowNull: false,
  })
  status!: "ongoing" | "completed" | "pending" | "cancelled";

  @Column({ type: DataType.DATE, allowNull: false })
  start_date!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  end_date!: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  supervisor_id!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;

  @BelongsTo(() => User, { foreignKey: "supervisor_id" })
  supervisor!: User;

  @HasMany(() => Task, { foreignKey: "project_id" })
  tasks!: Task[];
}

export default Project;

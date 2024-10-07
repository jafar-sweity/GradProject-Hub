import {
  Model,
  Column,
  Table,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import { Task } from "./index.js";

@Table({ tableName: "comments" })
class Comment extends Model<Comment> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  task_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @BelongsTo(() => Task, { foreignKey: "task_id" })
  task!: Task;
}

export default Comment;

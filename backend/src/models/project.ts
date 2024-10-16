import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.js";

@Table
class Project extends Model<Project> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  project_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  supervisor_id!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Project;

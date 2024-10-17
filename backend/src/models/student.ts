import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.js";
import Project from "./project.js";

@Table
class Student extends Model<Student> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  project_id!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Student;

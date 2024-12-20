import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user.js";
import Project from "./project.js";

@Table({
  tableName: "user_project_roles",
  timestamps: true,
})
class UserProjectRoles extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  user_id!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  project_id!: number;

  @Column({
    type: DataType.ENUM("student", "supervisor", "admin"),
    allowNull: false,
  })
  role!: "student" | "supervisor" | "admin";
  Project: null;
}

export default UserProjectRoles;

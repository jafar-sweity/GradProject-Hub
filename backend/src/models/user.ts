import { Model, Column, Table, DataType, HasMany } from "sequelize-typescript";
import { Project, Task } from "./index.js";

@Table({ tableName: "users" })
class User extends Model<User> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({
    type: DataType.ENUM("student", "supervisor", "admin"),
    allowNull: false,
  })
  role!: "student" | "supervisor" | "admin";

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;

  @HasMany(() => Project, { foreignKey: "supervisor_id" })
  projects!: Project[];

  @HasMany(() => Task, { foreignKey: "assigned_to" })
  tasks!: Task[];
}

export default User;

import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM("student", "supervisor", "admin"),
    allowNull: false,
  })
  role!: string;
}

export default User;

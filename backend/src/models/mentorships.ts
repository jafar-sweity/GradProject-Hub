import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.js";

@Table
class Mentorship extends Model<Mentorship> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  mentorship_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  mentor_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  mentee_id!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  start_date!: Date;

  @Column({ type: DataType.DATE })
  end_date?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Mentorship;

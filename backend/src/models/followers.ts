import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.js";

@Table
class Follower extends Model<Follower> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  follower_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  followed_user_id!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  followed_at!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Follower;

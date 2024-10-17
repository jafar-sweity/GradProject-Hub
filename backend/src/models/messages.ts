import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.js";

@Table
class Message extends Model<Message> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  message_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sender_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  receiver_id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  sent_at!: Date;

  @Column({ type: DataType.DATE })
  read_at?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Message;

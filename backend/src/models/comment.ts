import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import User from "./user.js";
import CommunityPost from "./community.js";

@Table
class Comment extends Model<Comment> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  comment_id!: number;

  @ForeignKey(() => CommunityPost)
  @Column({ type: DataType.INTEGER, allowNull: false })
  post_id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Comment;

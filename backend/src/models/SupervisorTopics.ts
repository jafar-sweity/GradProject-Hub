import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user.js"; // Assuming the User model is in the same directory

@Table({
  tableName: "SupervisorTopics",
  timestamps: true,
})
class SupervisorTopics extends Model<SupervisorTopics> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  supervisorId!: number;

  @BelongsTo(() => User)
  supervisor!: User;

  @Column({ type: DataType.STRING, allowNull: false })
  topic!: string;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    validate: { min: 0, max: 5 },
  })
  rating!: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt!: Date;
}

export default SupervisorTopics;

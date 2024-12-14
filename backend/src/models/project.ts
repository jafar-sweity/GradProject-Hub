import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { User, UserProjectRoles } from "./index.js";

@Table
class Project extends Model<Project> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  project_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.INTEGER })
  supervisor_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  abstract_url!: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  report_url!: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  demo_url!: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  video_demo_url!: string | null;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Project;

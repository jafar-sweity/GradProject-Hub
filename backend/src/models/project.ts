import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class Project extends Model<Project> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  project_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.INTEGER })
  supervisor_id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}

export default Project;

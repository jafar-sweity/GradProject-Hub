import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import UploadSetting from "./uploadSetting.js";

@Table({ tableName: "semesters", timestamps: true })
class Semester extends Model<Semester> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  semester_id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  start_date!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  end_date!: Date;

  @HasMany(() => UploadSetting)
  upload_settings!: UploadSetting[];
}

export default Semester;

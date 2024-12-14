import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Semester from "./semester.js";

@Table({ tableName: "upload_settings", timestamps: true })
class UploadSetting extends Model<UploadSetting> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  setting_id!: number;

  @ForeignKey(() => Semester)
  @Column({ type: DataType.INTEGER, allowNull: false })
  semester_id!: number;

  @BelongsTo(() => Semester)
  semester!: Semester;

  @Column({
    type: DataType.ENUM("abstract", "report", "demo"),
    allowNull: false,
  })
  file_type!: "abstract" | "report" | "demo";

  @Column({ type: DataType.DATE, allowNull: false })
  start_date!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  end_date!: Date;
}

export default UploadSetting;

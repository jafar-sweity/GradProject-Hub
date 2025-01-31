var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, ForeignKey, } from "sequelize-typescript";
import Semester from "./semester.js";
let UploadSetting = class UploadSetting extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], UploadSetting.prototype, "setting_id", void 0);
__decorate([
    ForeignKey(() => Semester),
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], UploadSetting.prototype, "semester_id", void 0);
__decorate([
    Column({
        type: DataType.ENUM("abstract", "report", "demo"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], UploadSetting.prototype, "file_type", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], UploadSetting.prototype, "start_date", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], UploadSetting.prototype, "end_date", void 0);
UploadSetting = __decorate([
    Table({ tableName: "upload_settings", timestamps: true })
], UploadSetting);
export default UploadSetting;
//# sourceMappingURL=uploadSetting.js.map
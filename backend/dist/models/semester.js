var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import UploadSetting from "./uploadSetting.js";
let Semester = class Semester extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Semester.prototype, "semester_id", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Semester.prototype, "name", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Semester.prototype, "start_date", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Semester.prototype, "end_date", void 0);
__decorate([
    HasMany(() => UploadSetting),
    __metadata("design:type", Array)
], Semester.prototype, "upload_settings", void 0);
Semester = __decorate([
    Table({ tableName: "semesters", timestamps: true })
], Semester);
export default Semester;
//# sourceMappingURL=semester.js.map
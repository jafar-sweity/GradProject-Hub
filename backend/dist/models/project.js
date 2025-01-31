var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType } from "sequelize-typescript";
import { Semester } from "./index.js";
import { ForeignKey } from "sequelize-typescript";
let Project = class Project extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Project.prototype, "project_id", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    ForeignKey(() => Semester),
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Project.prototype, "semester_id", void 0);
__decorate([
    Column({ type: DataType.INTEGER }),
    __metadata("design:type", String)
], Project.prototype, "supervisor_id", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], Project.prototype, "abstract_url", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], Project.prototype, "report_url", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], Project.prototype, "demo_url", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], Project.prototype, "video_demo_url", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], Project.prototype, "abstract_status", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", Object)
], Project.prototype, "abstract_comment", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
Project = __decorate([
    Table
], Project);
export default Project;
//# sourceMappingURL=project.js.map
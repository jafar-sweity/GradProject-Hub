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
import Task from "./task.js";
import User from "./user.js";
let SubTask = class SubTask extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], SubTask.prototype, "sub_task_id", void 0);
__decorate([
    ForeignKey(() => Task),
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], SubTask.prototype, "task_id", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], SubTask.prototype, "title", void 0);
__decorate([
    Column({ type: DataType.TEXT }),
    __metadata("design:type", String)
], SubTask.prototype, "description", void 0);
__decorate([
    Column({
        type: DataType.ENUM("Pending", "In Progress", "Completed"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], SubTask.prototype, "status", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], SubTask.prototype, "due_date", void 0);
__decorate([
    ForeignKey(() => User),
    Column({ type: DataType.INTEGER }),
    __metadata("design:type", Number)
], SubTask.prototype, "assigned_to", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], SubTask.prototype, "createdAt", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], SubTask.prototype, "updatedAt", void 0);
SubTask = __decorate([
    Table
], SubTask);
export default SubTask;
//# sourceMappingURL=subTask.js.map
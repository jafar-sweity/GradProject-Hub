var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Model, Column, DataType, Table, ForeignKey, } from "sequelize-typescript";
import User from "./user.js";
import Project from "./project.js";
let UserProjectRoles = class UserProjectRoles extends Model {
};
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], UserProjectRoles.prototype, "user_id", void 0);
__decorate([
    ForeignKey(() => Project),
    Column({
        type: DataType.INTEGER,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], UserProjectRoles.prototype, "project_id", void 0);
__decorate([
    Column({
        type: DataType.ENUM("student", "supervisor", "admin"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], UserProjectRoles.prototype, "role", void 0);
UserProjectRoles = __decorate([
    Table({
        tableName: "user_project_roles",
        timestamps: true,
    })
], UserProjectRoles);
export default UserProjectRoles;
//# sourceMappingURL=user_project_roles.js.map
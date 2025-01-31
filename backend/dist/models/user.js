var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, } from "sequelize-typescript";
let User = class User extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], User.prototype, "user_id", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({
        type: DataType.ENUM("student", "supervisor", "admin"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], User.prototype, "avatarurl", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], User.prototype, "notificationToken", void 0);
User = __decorate([
    Table({
        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
        ],
    })
], User);
export default User;
//# sourceMappingURL=user.js.map
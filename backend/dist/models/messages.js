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
import User from "./user.js";
let Message = class Message extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], Message.prototype, "message_id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Message.prototype, "sender_id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Message.prototype, "receiver_id", void 0);
__decorate([
    Column({ type: DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Message.prototype, "sent_at", void 0);
__decorate([
    Column({ type: DataType.DATE }),
    __metadata("design:type", Date)
], Message.prototype, "read_at", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    Column({ type: DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
Message = __decorate([
    Table
], Message);
export default Message;
//# sourceMappingURL=messages.js.map
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserProjectRoles } from "../models/index.js";
export const checkProjectTaskPermission = function () {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { projectId } = req.params;
            const userProjectRole = yield UserProjectRoles.findOne({
                where: {
                    user_id: userId,
                    project_id: projectId,
                },
            });
            if (!userProjectRole) {
                res
                    .status(403)
                    .json({ message: "You do not have access to this project" });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
//# sourceMappingURL=checkProjectTaskPermission.js.map
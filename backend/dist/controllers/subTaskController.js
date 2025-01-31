var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SubTask } from "../models/index.js";
export const createSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subTask = yield SubTask.create(req.body);
        res.status(201).json(subTask);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getSubTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subTask = yield SubTask.findByPk(id);
        if (subTask) {
            res.json(subTask);
        }
        else {
            res.status(404).json({ error: "SubTask not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const updateSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subTask = yield SubTask.findByPk(id);
        if (subTask) {
            yield subTask.update(req.body);
            res.json(subTask);
        }
        else {
            res.status(404).json({ error: "SubTask not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const deleteSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subTask = yield SubTask.findByPk(id);
        if (subTask) {
            yield subTask.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "SubTask not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getSubTasksByTaskId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const subTasks = yield SubTask.findAll({ where: { task_id: taskId } });
        res.json(subTasks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=subTaskController.js.map
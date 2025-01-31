var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Task from "../models/task.js";
export const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task.create(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield Task.findByPk(id);
        if (task) {
            res.json(task);
        }
        else {
            res.status(404).json({ error: "Task not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield Task.findByPk(id);
        if (task) {
            yield task.update(req.body);
            res.json(task);
        }
        else {
            res.status(404).json({ error: "Task not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield Task.findByPk(id);
        if (task) {
            yield task.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Task not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getTasksByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const tasks = yield Task.findAll({ where: { project_id: projectId } });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=taskController.js.map
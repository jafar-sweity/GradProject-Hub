var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Op } from "sequelize";
import { Semester } from "../models/index.js";
export const getSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semesters = yield Semester.findAll();
        res.status(200).json(semesters);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
export const getSemesterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = yield Semester.findByPk(req.params.id);
        if (semester) {
            res.status(200).json(semester);
        }
        else {
            res.status(404).json({ message: "Semester not found" });
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
export const createSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = yield Semester.create(req.body);
        res.status(201).json(semester);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export const updateSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = yield Semester.findByPk(req.params.id);
        if (semester) {
            yield semester.update(req.body);
            res.status(200).json(semester);
        }
        else {
            res.status(404).json({ message: "Semester not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export const deleteSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = yield Semester.findByPk(req.params.id);
        if (semester) {
            yield semester.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ message: "Semester not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export const getCurrentSemesterMethod = () => __awaiter(void 0, void 0, void 0, function* () {
    const semester = yield Semester.findOne({
        where: {
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() },
        },
    });
    if (!semester) {
        throw new Error("No active semester found");
    }
    return semester;
});
export const getCurrentSemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semester = yield getCurrentSemesterMethod();
        if (semester) {
            res.status(200).json(semester);
        }
        else {
            res.status(404).json({ message: "Current semester not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//# sourceMappingURL=semesterController.js.map
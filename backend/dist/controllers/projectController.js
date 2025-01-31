var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Project from "../models/project.js";
import { Semester, User, UserProjectRoles } from "../models/index.js";
import { getCurrentSemesterMethod, } from "./semesterController.js";
import { sendPushNotification } from "./notificationController.js";
export const createProjectBySupervisor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { name, description, students } = req.body;
        const currentSemester = yield getCurrentSemesterMethod();
        if (!currentSemester) {
            res.status(400).json({ message: "No current semester" });
            return;
        }
        const project = yield Project.create({
            name,
            description,
            semester_id: currentSemester.semester_id,
        });
        if (!project) {
            res.status(400).json({ message: "Project not created" });
            return;
        }
        const supervisor = yield UserProjectRoles.create({
            user_id: user === null || user === void 0 ? void 0 : user.id,
            project_id: project.project_id,
            role: "supervisor",
        });
        if (!supervisor) {
            res.status(400).json({ message: "Supervisor not added to project" });
            return;
        }
        for (const email of students) {
            const student = yield User.findOne({
                where: {
                    email: email,
                    role: "student",
                },
            });
            if (!student) {
                continue;
            }
            yield UserProjectRoles.create({
                user_id: student === null || student === void 0 ? void 0 : student.user_id,
                project_id: project.project_id,
                role: "student",
            });
            yield sendPushNotification(student.notificationToken, "Project Added", `You have been added to the project ${project.name} by the supervisor ${user === null || user === void 0 ? void 0 : user.name}`);
        }
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const deleteProjectBySupervisor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { projectId } = req.params;
        const projectRole = yield UserProjectRoles.findOne({
            where: {
                project_id: projectId,
                user_id: user === null || user === void 0 ? void 0 : user.id,
                role: "supervisor",
            },
        });
        if (!projectRole) {
            res
                .status(403)
                .json({ message: "You do not have access to this project" });
            return;
        }
        // await UserProjectRoles.destroy({
        //   where: {
        //     project_id: projectId,
        //   },
        // });
        const project = yield Project.findByPk(projectId);
        if (project) {
            yield project.destroy();
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Project not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Project.findAll();
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getProjectsBySemesterName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { semesterName } = req.params;
        const projects = yield Project.findAll({
            include: [
                {
                    model: Semester,
                    where: { name: semesterName },
                    attributes: ["name", "start_date", "end_date"],
                },
            ],
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Project.findByPk(req.params.id);
        if (project) {
            res.status(200).json(project);
        }
        else {
            res.status(404).json({ error: "Project not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, students } = req.body;
        const [updated] = yield Project.update({ name, description }, {
            where: { project_id: req.params.id },
        });
        if (!updated) {
            res.status(404).json({ error: "Project not found" });
            return;
        }
        const existingStudentRoles = yield UserProjectRoles.findAll({
            where: {
                project_id: req.params.id,
                role: "student",
            },
        });
        const existingStudentIds = existingStudentRoles.map((role) => role.user_id);
        const newStudentIds = [];
        for (const email of students) {
            const student = yield User.findOne({
                where: {
                    email: email,
                    role: "student",
                },
            });
            if (!student)
                continue;
            newStudentIds.push(student.user_id);
            if (!existingStudentIds.includes(student.user_id)) {
                yield UserProjectRoles.create({
                    user_id: student.user_id,
                    project_id: req.params.id,
                    role: "student",
                });
                if (student.notificationToken) {
                    yield sendPushNotification(student.notificationToken, "Project Updated", `You have been added to the project "${name}".`);
                }
            }
        }
        for (const existingStudentId of existingStudentIds) {
            if (!newStudentIds.includes(existingStudentId)) {
                yield UserProjectRoles.destroy({
                    where: {
                        user_id: existingStudentId,
                        project_id: req.params.id,
                        role: "student",
                    },
                });
                const removedStudent = yield User.findByPk(existingStudentId);
                if (removedStudent === null || removedStudent === void 0 ? void 0 : removedStudent.notificationToken) {
                    yield sendPushNotification(removedStudent.notificationToken, "Project Updated", `You have been removed from the project "${name}".`);
                }
            }
        }
        const updatedProject = yield Project.findByPk(req.params.id);
        res.status(200).json(updatedProject);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const updateProjectStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { abstract_status, abstract_comment } = req.body;
        const [updated] = yield Project.update({ abstract_status, abstract_comment }, {
            where: { project_id: req.params.id },
        });
        if (!updated) {
            res.status(404).json({ error: "Project not found" });
            return;
        }
        const updatedProject = yield Project.findByPk(req.params.id);
        res.status(200).json(updatedProject);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield Project.destroy({
            where: { project_id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Project not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getProjectsBySupervisorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supervisorId } = req.params;
        const { semesterName } = req.query;
        const projects = yield UserProjectRoles.findAll({
            where: {
                user_id: supervisorId,
                role: "supervisor",
            },
            include: [
                {
                    model: Project,
                    include: [
                        {
                            model: Semester,
                            where: semesterName ? { name: semesterName } : {},
                            attributes: ["name", "start_date", "end_date"],
                        },
                    ],
                },
            ],
        });
        const filteredProjects = projects.filter((project) => project.Project !== null);
        res.status(200).json(filteredProjects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getProjectsByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.studentId;
        const projects = yield UserProjectRoles.findAll({
            where: {
                user_id: studentId,
                role: "student",
            },
            include: [Project],
        });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const addStudentToProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { projectId, studentId } = req.params;
        const supervisorId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const studentRole = yield User.findOne({
            where: {
                user_id: studentId,
                role: "student",
            },
        });
        if (!studentRole) {
            res.status(400).json({ message: "User is not a student" });
            return;
        }
        const projectRole = yield UserProjectRoles.findOne({
            where: {
                project_id: projectId,
                user_id: supervisorId,
                role: "supervisor",
            },
        });
        if (!projectRole) {
            res
                .status(403)
                .json({ message: "You do not have access to this project" });
            return;
        }
        const student = yield User.findByPk(studentId);
        if (student) {
            yield UserProjectRoles.create({
                user_id: studentId,
                project_id: projectId,
                role: "student",
            });
            res
                .status(200)
                .json({ message: "Student added to project successfully" });
        }
        else {
            res.status(404).json({ message: "Student not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const removeStudentFromProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { projectId, studentId } = req.params;
        const supervisorId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id;
        const projectRole = yield UserProjectRoles.findOne({
            where: {
                project_id: projectId,
                user_id: supervisorId,
                role: "supervisor",
            },
        });
        if (!projectRole) {
            res
                .status(403)
                .json({ message: "You do not have access to this project" });
            return;
        }
        const studentRole = yield UserProjectRoles.findOne({
            where: {
                project_id: projectId,
                user_id: studentId,
                role: "student",
            },
        });
        if (studentRole) {
            yield studentRole.destroy();
            res
                .status(200)
                .json({ message: "Student removed from project successfully" });
        }
        else {
            res.status(404).json({ message: "Student not found in project" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const getMemebersByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.projectId;
        const members = yield UserProjectRoles.findAll({
            where: {
                project_id: projectId,
            },
            include: [User],
        });
        res.status(200).json(members);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=projectController.js.map
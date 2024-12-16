import { Request, Response } from "express";
import Project from "../models/project.js";
import { Semester, User, UserProjectRoles } from "../models/index.js";

export const createProjectBySupervisor = async (
  req: Request,
  res: Response
) => {
  try {
    const { user } = req;

    const project = await Project.create(req.body);
    await UserProjectRoles.create({
      user_id: user?.id,
      project_id: project.project_id,
      role: "supervisor",
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProjectBySupervisor = async (
  req: Request,
  res: Response
) => {
  try {
    const { user } = req;
    const { projectId } = req.params;

    const projectRole = await UserProjectRoles.findOne({
      where: {
        project_id: projectId,
        user_id: user?.id,
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

    const project = await Project.findByPk(projectId);
    if (project) {
      await project.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const [updated] = await Project.update(req.body, {
      where: { project_id: req.params.id },
    });
    if (updated) {
      const updatedProject = await Project.findByPk(req.params.id);
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const deleted = await Project.destroy({
      where: { project_id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectsBySupervisorId = async (
  req: Request,
  res: Response
) => {
  try {
    const { supervisorId } = req.params;
    const { semesterName } = req.query;

    const projects = await UserProjectRoles.findAll({
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

    const filteredProjects = projects.filter(
      (project) => project.Project !== null
    );
    res.status(200).json(filteredProjects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectsByStudentId = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;

    const projects = await UserProjectRoles.findAll({
      where: {
        user_id: studentId,
        role: "student",
      },
      include: [Project],
    });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addStudentToProject = async (req: Request, res: Response) => {
  try {
    const { projectId, studentId } = req.params;
    const supervisorId = req?.user?.id;

    const studentRole = await User.findOne({
      where: {
        user_id: studentId,
        role: "student",
      },
    });

    if (!studentRole) {
      res.status(400).json({ message: "User is not a student" });
      return;
    }

    const projectRole = await UserProjectRoles.findOne({
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

    const student = await User.findByPk(studentId);
    if (student) {
      await UserProjectRoles.create({
        user_id: studentId,
        project_id: projectId,
        role: "student",
      });
      res
        .status(200)
        .json({ message: "Student added to project successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeStudentFromProject = async (req: Request, res: Response) => {
  try {
    const { projectId, studentId } = req.params;
    const supervisorId = req?.user?.id;

    const projectRole = await UserProjectRoles.findOne({
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

    const studentRole = await UserProjectRoles.findOne({
      where: {
        project_id: projectId,
        user_id: studentId,
        role: "student",
      },
    });

    if (studentRole) {
      await studentRole.destroy();
      res
        .status(200)
        .json({ message: "Student removed from project successfully" });
    } else {
      res.status(404).json({ message: "Student not found in project" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemebersByProjectId = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId;

    const members = await UserProjectRoles.findAll({
      where: {
        project_id: projectId,
      },
      include: [User],
    });

    res.status(200).json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

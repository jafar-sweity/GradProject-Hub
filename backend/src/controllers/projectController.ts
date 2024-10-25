import { Request, Response } from "express";
import Project from "../models/project.js";
import { User } from "../models/index.js";

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
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
    const projects = await Project.findAll({
      where: { supervisor_id: supervisorId },
    });
    if (projects.length > 0) {
      res.status(200).json(projects);
    } else {
      res
        .status(404)
        .json({ message: "No projects found for this supervisor" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// export const addStudentToProject = async (req: Request, res: Response) => {
//   try {
//     const { projectId, studentId } = req.params;
//     const supervisorId = req?.user?.id;

//     const project = await Project.findOne({
//       where: { project_id: projectId, supervisor_id: supervisorId },
//     });

//     if (!project) {
//       return res
//         .status(403)
//         .json({ message: "You do not have access to this project" });
//     }

//     const student = await User.findByPk(studentId);
//     if (student) {
//       await project.addUser(student); // Assuming you have a many-to-many relationship set up
//       res
//         .status(200)
//         .json({ message: "Student added to project successfully" });
//     } else {
//       res.status(404).json({ message: "Student not found" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const removeStudentFromProject = async (req: Request, res: Response) => {
//   try {
//     const { projectId, studentId } = req.params;
//     const supervisorId = req?.user?.id; // Assuming you have middleware to set req.user

//     // Verify that the supervisor has access to the project
//     const project = await Project.findOne({
//       where: { project_id: projectId, supervisor_id: supervisorId },
//     });

//     if (!project) {
//       return res
//         .status(403)
//         .json({ message: "You do not have access to this project" });
//     }

//     const student = await User.findByPk(studentId);
//     if (student) {
//       await project.removeUser(student); // Assuming you have a many-to-many relationship set up
//       res
//         .status(200)
//         .json({ message: "Student removed from project successfully" });
//     } else {
//       res.status(404).json({ message: "Student not found" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

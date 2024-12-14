import Project from "../models/project.js";
import { Request, Response } from "express";

export const storeUrl = async (req: Request, res: Response) => {
  try {
    const { projectId, url, urlType } = req.body as {
      projectId: string;
      url: string;
      urlType: "abstract" | "demo" | "report";
    };

    const project = await Project.findByPk(projectId);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    switch (urlType) {
      case "abstract":
        project.abstract_url = url;
        break;
      case "demo":
        project.demo_url = url;
        break;
      case "report":
        project.report_url = url;
        break;
      default:
        res.status(400).json({ message: "Invalid type provided" });
        return;
    }

    await project.save();

    res.status(200).json({
      message: `${
        urlType.charAt(0).toUpperCase() + urlType.slice(1)
      } URL stored successfully`,
      project,
    });
  } catch (error) {
    console.error("Error storing URL:", error);
    res.status(500).json({
      message: "Server error occurred while storing URL",
      error,
    });
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { projectId, urlType } = req.query as {
      projectId: string;
      urlType: string;
    };

    const project = await Project.findByPk(projectId);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    switch (urlType) {
      case "abstract":
        project.abstract_url = null;
        break;
      case "demo":
        project.demo_url = null;
        break;
      case "report":
        project.report_url = null;
        break;
      default:
        res.status(400).json({ message: "Invalid URL type" });
        return;
    }

    await project.save();

    res
      .status(200)
      .json({ message: `${urlType} URL deleted successfully`, project });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({
      message: "Server error occurred while deleting URL",
      error,
    });
  }
};

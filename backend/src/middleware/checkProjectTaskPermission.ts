import { Request, Response, NextFunction } from "express";
import { Project, Task, UserProjectRoles } from "../models/index.js";

export const checkProjectTaskPermission = function () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id;
      const { projectId } = req.params;

      const userProjectRole = await UserProjectRoles.findOne({
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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};

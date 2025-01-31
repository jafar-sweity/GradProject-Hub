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
export const storeUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, url, urlType } = req.body;
        const project = yield Project.findByPk(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        switch (urlType) {
            case "abstract":
                project.abstract_url = url;
                break;
            case "video_demo":
                project.video_demo_url = url;
                break;
            case "report":
                project.report_url = url;
                break;
            default:
                res.status(400).json({ message: "Invalid type provided" });
                return;
        }
        yield project.save();
        res.status(200).json({
            message: `${urlType.charAt(0).toUpperCase() + urlType.slice(1)} URL stored successfully`,
            project,
        });
    }
    catch (error) {
        console.error("Error storing URL:", error);
        res.status(500).json({
            message: "Server error occurred while storing URL",
            error,
        });
    }
});
export const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, urlType } = req.query;
        const project = yield Project.findByPk(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        switch (urlType) {
            case "abstract":
                project.abstract_url = null;
                break;
            case "video_demo":
                project.demo_url = null;
                break;
            case "report":
                project.report_url = null;
                break;
            default:
                res.status(400).json({ message: "Invalid URL type" });
                return;
        }
        yield project.save();
        res
            .status(200)
            .json({ message: `${urlType} URL deleted successfully`, project });
    }
    catch (error) {
        console.error("Error deleting URL:", error);
        res.status(500).json({
            message: "Server error occurred while deleting URL",
            error,
        });
    }
});
//# sourceMappingURL=uploadController.js.map
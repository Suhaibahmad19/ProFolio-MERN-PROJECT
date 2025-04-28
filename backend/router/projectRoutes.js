import express from "express";
import {
  getAllProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addProject);
router.get("/getall", getAllProjects);
router.get("/get/:id", getProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);
router.put("/update/:id", isAuthenticated, updateProject);

export default router;

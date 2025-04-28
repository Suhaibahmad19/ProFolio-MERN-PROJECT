import express from "express";
import {
  addNewSkill,
  updateSkill,
  getAllSkills,
  deleteSkill,
} from "../controller/skillController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, addNewSkill);
router.put("/update/:id", isAuthenticated, updateSkill);
router.delete("/delete/:id", isAuthenticated, deleteSkill);
router.get("/getall", getAllSkills);

export default router;

import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createTask,
  fetchTasks,
  updateTask,
  deleteTask,
} from "../routes/task-route.js";

const taskRouter = Router();

taskRouter.get("/", authenticate, fetchTasks);
taskRouter.post("/", authenticate, createTask);
taskRouter.put("/:id", authenticate, updateTask);
taskRouter.delete("/:id", authenticate, deleteTask);

export default taskRouter;

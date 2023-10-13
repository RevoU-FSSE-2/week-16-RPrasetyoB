import { Request, Response } from "express";
import { taskModel } from "../config/schemas/schema";
import { deleteMakerTasks, getMakerTasks, updateMakerTasks } from "../services/taskService";
import getCookie from "../reusable/getCookie";
import jwt from "jsonwebtoken";

//------ getTasks ------
const getAllTask = async (req: Request, res: Response) => {
  const tokenCookie = getCookie(req);
  const decodedToken: jwt.JwtPayload = jwt.decode(
    tokenCookie
  ) as jwt.JwtPayload;
  const userRole = decodedToken.role;
  try {
    if (userRole === "manager") {
      const task = await getMakerTasks();
      return res.status(200).json({
        success: true,
        message: "Successfully fetched all tasks",
        data: task,
      });
    } else {
      const username = decodedToken.username;
      const task = await getMakerTasks(username);
      return res.status(200).json({
        success: true,
        message: "Successfully fetched tasks for the user",
        data: task,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get tasks",
    });
  }
};

const createTask = async (req: Request, res: Response) => {
  const tokenCookie = getCookie(req);
  const decodedToken: jwt.JwtPayload = jwt.decode(
    tokenCookie
  ) as jwt.JwtPayload;
  const username = decodedToken.username;
  try {
    const { task } = req.body;

    const newTask = await taskModel.create({ task, maker: username });
    return res.status(200).json({
      success: true,
      message: "Task registration success",
      data: newTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const updateTask = async (req: Request, res: Response) => {
  const tokenCookie = getCookie(req);
  const decodedToken: jwt.JwtPayload = jwt.decode(
    tokenCookie
  ) as jwt.JwtPayload;
  const username = decodedToken.username;

  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedStatus = await updateMakerTasks(id, status, username);

    if (updatedStatus.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully updated status",
        data: {
          status: status,
        },
      });
    } else {
      return res.status(updatedStatus.status).json({
        success: false,
        message: updatedStatus.message,
      });
    }
  } catch (err) {
    console.log("Error updating status:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the status",
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const tokenCookie = getCookie(req);
  const decodedToken: jwt.JwtPayload = jwt.decode(tokenCookie) as jwt.JwtPayload;
  const username = decodedToken.username;

  try {
    const { id } = req.params;
    const task = await taskModel.findOne({ _id: id });

    if (task && task.maker === username) {
      const deletedTask = await deleteMakerTasks(id, username);

      if (deletedTask.status = 200) {
        return res.status(200).json({
          success: true,
          message: "Task deleted successfully",
          data: deletedTask,
        });
      } else {
        return res.status(deletedTask.status).json({
          success: false,
          message: 'Failed deteted task',
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this task",
      });
    }
  } catch (err) {
    console.log("Error deleting task:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the task",
    });
  }
};

export { createTask, getAllTask, updateTask, deleteTask };

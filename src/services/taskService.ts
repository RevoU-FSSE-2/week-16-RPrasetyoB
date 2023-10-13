import { taskModel, userModel } from "../config/schemas/schema";
import bcrypt from "bcrypt";
import { addDays } from "date-fns";
import { JwtPayload, sign } from "jsonwebtoken";
import { JWT_Sign } from "../config/auth/jwt";
import NodeCache from "node-cache";
import ErrorCatch from "../reusable/errorCatch";

//------ get tasks ------
const getMakerTasks = async (username?: string) => {
  try {
    const query = username
      ? { maker: username, isDeleted: { $exists: false } }
      : { isDeleted: { $exists: false } };
    const tasks = await taskModel.find(query);
    return {
      success: true,
      status: 200,
      message: username
        ? "Successfully fetched tasks"
        : "Successfully fetched all tasks",
      data: tasks,
    };
  } catch (error: any) {
    throw new ErrorCatch({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

// ------ update task ------
const updateMakerTasks = async (id: string, status: string, maker: string) => {
  try {
    const task = await taskModel.findOne({ _id: id, maker: maker });

    if (!task) {
      return {
        success: false,
        status: 404,
        message: "Task not found or you do not have permission to update it",
        data: null,
      };
    }

    await taskModel.updateOne({ _id: id }, { status: status });

    return {
      success: true,
      status: 200,
      message: "Successfully updated task",
      data: task,
    };
  } catch (error: any) {
    throw new ErrorCatch({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

const deleteMakerTasks = async (id: string, maker: string) => {
    try {
      const task = await taskModel.findOne({ _id: id, maker: maker });
  
      if (!task) {
        return {
          success: false,
          status: 404,
          message: "Task not found or you do not have permission to delete it",
          data: null,
        };
      }
  
      const deletedTask = await taskModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true } },
        { new: true }
      );
  
      return {
        status: 200,
        data: deletedTask,
      };
    } catch (error: any) {
      throw new ErrorCatch({
        success: false,
        message: error.message,
        status: 500,
      });
    }
  };

export { getMakerTasks, updateMakerTasks, deleteMakerTasks };

import { NextFunction, Request, Response } from 'express';
import { userModel } from '../config/schemas/schema';
import { loginUser, registerUser, updateRole } from '../services/userService'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_Sign } from '../config/auth/jwt';

//------ Login user ------
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser({ username, password });
    if (result.success) {
  
      res.cookie("accessToken", result.message.accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        path: '/'
      });
      res.cookie("refreshToken", result.message.refreshToken, {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        path:'/'
      });

      return res.status(200).json({
        success: true,
        message: "Successfully login",
        data: result.message,
      });
    }
  } catch (error) {
    next(error);
  }
};


//------ Create user ------
const regUser = async (req : Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const result = await registerUser({ username, email, password})
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Registration success',
        data: result.message
      })
    }
  } catch (error) {
    next(error);
  }
};


//------ Update Role ------
interface JwtPayload {
  id: string; 
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const token = req.cookies.accessToken;
    if (!token) {
      throw new Error("You are unauthorized");
    }
    const decodedToken = jwt.verify(token, JWT_Sign) as JwtPayload
    const userId = decodedToken.id; 
    const updatedRole = await updateRole({ _id: userId, role: role });

    if (updatedRole?.success) {
      res.status(200).json({
        success: true,
        message: 'Update role success',
        data: updatedRole
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
}

//------ log out ------
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
      res.clearCookie('accessToken', {
        httpOnly: true,
        path: '/'
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        path: '/'
      });
      return res.status(200).json({    
          success: true,
          message: 'Successfully logout'
      })
  } catch (error: any) {
      next(error)
  }
}

//------ Update user ------
const updateUser = async (req: Request, res: Response) => {
  try {
    
    const userId = req.params.id;
    const updates = req.body;
    const { username, password, role } = updates;
    
    if (!username) {
       return res.status(400).json({
         success: false,
         message: "Username cannot be empty"
       });
     }
    
    const existingUser = await userModel.findOne({ username });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({
        success: false,
        message: "Username already exists"
      });
    }

    if (role !== "employee") {
      return res.status(400).json({
        success: false,
        message: "Possible role only Employee"
      });
    }

    if (password && password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    if (password && !/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return res.status(400).json({
          success: false,
          message: "Password must contain both alphabetic and numeric characters"
      });
    }

    if (password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true });

    if (updatedUser) {
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          _id: userId,
          username,
          role,
          passwordUpdated: !!password,
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: 'Not found'
      });
    }
  } catch (error) {
    console.log('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the user or userId wrong format'
    });
  }
};

//------ Get all users ------
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find({})
 
    return res.status(200).json({
      success: true,
      message: "success get all user",
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "failed to get all users"
    });
  }
};

//------ Get one user by id ------
const getOneUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await userModel.findById(id);
      if(!user) {
        return res.status(404).json({
          message: "user not found"
        })
      }

      return res.status(200).json({
        success: true,
        message: "success get user",
        user: user,
      });
    } catch (err) {
    console.log('Error get user:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while get the user or userId wrong format'
    });
  }
};

//------ Delete user ------
const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const deletedUser = await userModel.findByIdAndDelete(id);

    if(deletedUser) {
        return res.status(201).json({
            success: true,
            message: 'user deleted successfully',
            data: {id}
        })
    } else {
        return res.status(404).json({
            success: false,
            message: "failed to delete a user",
            data: "Not found"
        })
    }
  } catch (error) {
    console.log('Error delete user:', error);
    return res.status(500).json({
        message: 'An error occurred while deleting the user or userId wrong format'
    });
  }
};

export { getAllUsers, getOneUser, regUser, login, deleteUser, updateUser, update, logoutUser}


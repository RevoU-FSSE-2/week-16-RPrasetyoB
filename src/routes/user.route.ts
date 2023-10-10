import express from 'express'
const userRoutes = express.Router()
import { getAllUsers, getOneUser, regUser, loginUser, deleteUser, updateUser } from '../controllers/user.controller'
import { authRole, managerAuth } from '../middlewares/role.access'


userRoutes.get('/v1/users', getAllUsers)
userRoutes.get('/v1/users/:id', getOneUser)
userRoutes.post('/v1/auth/register', regUser)
userRoutes.post('/v1/auth/login', loginUser)
userRoutes.delete('/v1/users/:id', managerAuth, deleteUser)
userRoutes.patch('/v1/users/:id', authRole, updateUser)

export default userRoutes
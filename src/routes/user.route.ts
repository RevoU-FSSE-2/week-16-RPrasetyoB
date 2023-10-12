import express from 'express'
const userRoutes = express.Router()
import { getAllUsers, getOneUser, regUser, login, deleteUser, update } from '../controllers/userController'
import { authRole, managerAuth } from '../middlewares/role.access'


userRoutes.get('/v1/users', getAllUsers)
userRoutes.get('/v1/users/:id', getOneUser)
userRoutes.post('/v1/auth/register', regUser)
userRoutes.post('/v1/auth/login', login)
userRoutes.delete('/v1/users/:id', managerAuth, deleteUser)
userRoutes.put('/v1/users/:id', update)

export default userRoutes
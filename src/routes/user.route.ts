import express from 'express'
const userRoutes = express.Router()
import { getAllUsers, regUser, login, update, logoutUser } from '../controllers/userController'
import { authRole, managerAuth } from '../middlewares/role.access'


userRoutes.get('/users', managerAuth, getAllUsers)
userRoutes.post('/auth/register', regUser)
userRoutes.post('/auth/login', login)
userRoutes.post('/logout', logoutUser)
userRoutes.put('/users', update)

export default userRoutes
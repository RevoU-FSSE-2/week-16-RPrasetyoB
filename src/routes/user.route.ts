import express from 'express'
const userRoutes = express.Router()
import { getAllUsers, regUser, login, update, logoutUser, resetPassReq, resetPass } from '../controllers/userController'
import { authRole, managerAuth } from '../middlewares/role.access'
import { refreshAccessToken } from '../services/userService'


userRoutes.get('/users', getAllUsers)
userRoutes.post('/auth/register', regUser)
userRoutes.post('/auth/login', login)
userRoutes.post('/logout', logoutUser)
userRoutes.put('/users', update)
userRoutes.post('/reset-req', resetPassReq)
userRoutes.post('/reset', resetPass)
userRoutes.post('/refresh-token', refreshAccessToken)

export default userRoutes
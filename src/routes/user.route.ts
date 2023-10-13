import express from 'express'
const userRoutes = express.Router()
import { getAllUsers, regUser, login, update, logoutUser, resetPassReq, resetPass, accessTokenRefresh } from '../controllers/userController'


userRoutes.get('/users', getAllUsers)
userRoutes.put('/users', update)
userRoutes.post('/reset-req', resetPassReq)
userRoutes.post('/reset', resetPass)
userRoutes.post('/refresh-token', accessTokenRefresh)

export default userRoutes
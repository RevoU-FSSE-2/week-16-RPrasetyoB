import express from 'express'
import { login, logoutUser, regUser } from '../controllers/userController'

const authRoute = express.Router()


authRoute.post('/v1/auth/register', regUser)
authRoute.post('/v1/auth/login', login)
authRoute.post('/v1/logout', logoutUser)

export default authRoute
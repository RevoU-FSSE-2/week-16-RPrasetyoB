import express from 'express'
import { accessTokenRefresh, login, logoutUser, regUser } from '../controllers/userController'

const authRoute = express.Router()


authRoute.post('/v1/auth/register', regUser)
authRoute.post('/v1/auth/login', login)
authRoute.post('/v1/logout', logoutUser)
authRoute.post('/v1/refresh-token', accessTokenRefresh)

export default authRoute
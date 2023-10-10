import express from 'express'
import { Request, Response } from 'express'
const routes = express.Router()
import userRoutes from './user.route'
import taskRoutes from './task.route'

routes.get('/', (req: Request, res : Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to RPB rest API'
    })
})

routes.use('/', userRoutes)
routes.use('/', taskRoutes)

export default routes;
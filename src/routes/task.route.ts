import express from 'express'
import { authRole, managerAuth } from '../middlewares/role.access'
import { getAllTask, getOneTask, createTask, updateTask, deleteTask } from '../controllers/task.controller'

const taskRoutes = express.Router()
taskRoutes.get('/v1/tasks', authRole, getAllTask)
taskRoutes.get('/v1/tasks/:id', authRole, getOneTask)
taskRoutes.post('/v1/tasks', managerAuth, createTask)
taskRoutes.patch('/v1/tasks/:id', authRole, updateTask)
taskRoutes.delete('/v1/tasks/:id', managerAuth, deleteTask)

export default taskRoutes
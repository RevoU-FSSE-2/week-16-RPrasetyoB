import express from 'express'
import { authRole, managerAuth } from '../middlewares/role.access'
import { getAllTask, getOneTask, createTask, updateTask, deleteTask } from '../controllers/taskController'

const taskRoutes = express.Router()
taskRoutes.get('/tasks', authRole, getAllTask)
taskRoutes.get('/tasks/:id', authRole, getOneTask)
taskRoutes.post('/tasks', managerAuth, createTask)
taskRoutes.patch('/tasks/:id', authRole, updateTask)
taskRoutes.delete('/tasks/:id', managerAuth, deleteTask)

export default taskRoutes
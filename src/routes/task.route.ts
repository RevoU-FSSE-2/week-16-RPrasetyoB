import express from 'express'
import { getAllTask, createTask, updateTask, deleteTask } from '../controllers/taskController'

const taskRoutes = express.Router()

taskRoutes.get('/tasks', getAllTask)
taskRoutes.post('/tasks', createTask)
taskRoutes.put('/tasks/:id', updateTask)
taskRoutes.delete('/tasks/:id', deleteTask)

export default taskRoutes
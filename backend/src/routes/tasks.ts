import express from 'express'
import * as TaskController from '../controllers/taskController'
const router = express.Router()

router.get('/', TaskController.getAll)
router.post('/', TaskController.create)
router.patch('/:id', TaskController.update)
router.delete('/:id', TaskController.remove)

export default router

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../services/task.service")



const createTaskController = async (req, res, next) => {
  // console.log('TaskCreating');
  const createTaskService = await createTask(req.body)

  return res.json(createTaskService)
}

const getAllTasksController = async (req, res, next) => {
  const getAllTasksService = await getAllTasks()
  return res.json(getAllTasksService)
}

const updateTaskController = async (req, res, next) => {
  // console.log('req.params.name');
  // console.log(req.params.name);
  const updateTaskService = await updateTask(req.params)

  return res.json(updateTaskService)
}

const deleteTaskController = async (req, res, next) => {
  // console.log('req.params.name');
  // console.log(req.params.name);
  const deleteTaskService = await deleteTask(req.params.name)

  return res.json(deleteTaskService)
}

module.exports = {
  createTaskController,
  getAllTasksController,
  updateTaskController,
  deleteTaskController,
}
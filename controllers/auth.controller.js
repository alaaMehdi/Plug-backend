const {
  signin,
  signup,
  update,
  requestPasswordReset,
  resetPassword,
  profile,
  createPoll,
  votePoll,
  getAllPolls,
  createTask,
  getAllTasks,
  deleteTask,
} = require("../services/auth.service")

const createTaskController = async (req, res, next) => {
  console.log('TaskCreating');
  const createTaskService = await createTask(req.body)

  return res.json(createTaskService)
}

const deleteTaskController = async (req, res, next) => {
  // console.log('req.params.name');
  // console.log(req.params.name);
  const deleteTaskService = await deleteTask(req.params.name)

  return res.json(deleteTaskService)
}

const getAllTasksController = async (req, res, next) => {
  const getAllTasksService = await getAllTasks()
  return res.json(getAllTasksService)
}

const createPollController = async (req, res, next) => {
  console.log('createPollController');
  const createPollService = await createPoll(req.body)

  return res.json(createPollService)
}

const votePollController = async (req, res, next) => {
  console.log('createPollController');
  const votePollService = await votePoll(req.body)
  return res.json(votePollService)
}

const getAllPollsController = async (req, res, next) => {
  const getAllPollsService = await getAllPolls()
  return res.json(getAllPollsService)
}


const userProfileController = async (req, res, next) => {
  const uProfileService = await profile(req.body)
  return res.json(uProfileService)
}

const signInController = async (req, res, next) => {
  const signinService = await signin(
    req.body.email,
    req.body.password
  )
  return res.json(signinService)
}

const updateController = async (req, res, next) => {
  const updateService = await update(
    req.body,
    req.params.id
  )
  return res.json(updateService.extras)
}

const signUpController = async (req, res, next) => {
  const signupService = await signup(req.body)
  return res.json(signupService)
}

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  )
  return res.json(requestPasswordResetService)
}

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password ,
  )
  return res.json(resetPasswordService)
}

module.exports = {
  signInController,
  signUpController,
  updateController,
  resetPasswordRequestController,
  resetPasswordController,
  userProfileController,
  createPollController,
  getAllPollsController,
  votePollController,
  createTaskController,
  getAllTasksController,
  deleteTaskController,
}
const {
  createPoll,
  votePoll,
  getAllPolls,
} = require("../services/poll.service")

const createPollController = async (req, res, next) => {
  console.log('createPollController');
  const createPollService = await createPoll(req.body)

  return res.json(createPollService)
}

const getAllPollsController = async (req, res, next) => {
  const getAllPollsService = await getAllPolls()
  return res.json(getAllPollsService)
}

const votePollController = async (req, res, next) => {
  console.log('createPollController');
  const votePollService = await votePoll(req.body)
  return res.json(votePollService)
}

module.exports = {
  createPollController,
  getAllPollsController,
  votePollController,
}
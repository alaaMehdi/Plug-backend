const Poll = require('../models/poll.model')


const createPoll = async (data) => {
  /** @Exemple
   * title:What is your favorit COLOR ?
     options:{ "option1" : {"desc":"red", "value":5.0},"option2": {"desc":"blue", "value":3.0}, "option3": {"desc":"green", "value":11.0},"option4": {"desc":"yellow", "value":8.0}}
   */
  let response
  const poll = new Poll(data)
  try {
    await poll.save()
    response = {
      success: true,
      status: 200,
      extras: { message: 'Poll created' }
    }
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: {
        message: 'Cannot create a poll',
        error: e
      }
    }
  }

  return (response)
}

const votePoll = async (data) => {

  let response
  let poll = await Poll.findById({ _id: data._id })
  let voteOptions = poll.options
  let canVote = poll.usersWhoVoted.includes(data.email)

  if (canVote) {
    response = {
      success: false,
      status: 203,
      extras: 'User already voted'
    }
  }
  else {
    poll.usersWhoVoted.push(data.email)
    let v = voteOptions.option2.value
    v++
    voteOptions.option2.value = v
    /* for getting all the vote Options
    Object.keys(voteOptions).forEach(
      option => console.log(voteOptions[option])
    )
    */
    try {
      await poll.updateOne({
        usersWhoVoted: poll.usersWhoVoted
      })
      await poll.updateOne({
        options: voteOptions
      })

      response = {
        success: true,
        status: 200,
        extras: {
          message: 'Poll updated',
          poll: poll
        }
      }
    } catch (e) {
      response = {
        success: false,
        status: 417,
        extras: {
          message: 'Cannot update a poll',
          error: e
        }
      }
    }
  }

  return (response)
}

const getAllPolls = async () => {
  let response
  await Poll.find()
    .then(polls => response = {
      success: true,
      status: 200,
      extras: {
        message: 'Getting all polls',
        polls: polls
      }
    })
    .catch(error => response = {
      success: false,
      status: 400,
      extras: { message: error }
    })
  return (response)
}

module.exports = {
  createPoll,
  votePoll,
  getAllPolls,
}
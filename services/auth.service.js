const JWT = require('jsonwebtoken')
const User = require('../models/user.model')
const Poll = require('../models/poll.model')
const Task = require('../models/task.model')
const Token = require('../models/token.model')
const sendEmail = require('../utils/email/sendEmail')
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const { getAllTasksController } = require('../controllers/auth.controller')

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const profile = async (data) => { }

const signin = async (_email, _password) => {
  let response;
  const hash = await crypto.createHash('md5').update(_password).digest("hex")
  _password = hash
  await User.findOne({
    email: _email,
    password: _password
  }, (err, user) => {
    if (err) {
      response = {
        success: false,
        status: 500,
        extras: { message: err }
      }
    }
    if (!user) {
      console.log(user)
      response = {
        success: false,
        status: 203,
        extras: { message: 'Email or passowrd incorrect' }
      }
    } else {
      const token = JWT.sign(
        { id: user._id }, 
        JWTSecret, 
        { expiresIn: '24h' }
      )
      response = {
        success: true,
        status: 200,
        extras: {
          message: 'User found',
          currentuser: {
            userId: user._id,
            email: user.email,
            token: token
          }
        }
      }
    }
  })
  console.log(response);
  return (response)
}

const signup = async (data) => {
  let response;
  let user = await User.findOne({ email: data.email, username: data.username })
  if (user) {
    response = {
      success: false,
      status: 203,
      extras: 'User already exist'
    }
  }
  user = new User(data);


  try {
    await user.save()
    response = {
      success: true,
      status: 200,
      extras: { message: 'User created' }
    }
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: { message: 'User already exist', error: e }
    }
  }
  return (response)
}

const update = async (body, params) => {
  let response
  const hash = await crypto.createHash('md5').update(body.password).digest("hex")
  body.password = hash
  const hash2 = await crypto.createHash('md5').update(body.newPass).digest("hex")
  body.newPass = hash2
  await User.updateOne({
    email: body.email,
    password: body.password
  }, {
    email: body.newEmail,
    password: body.newPass
  }, (err, user) => {
    if (err) {
      response = {
        success: false,
        status: 404,
        extras: { message: err }
      }
    }
    if (!user) {
      console.log(user)
      response = {
        success: false,
        status: 203,
        extras: { message: 'Erreur updating the user' }
      }
    } else {
      response = {
        success: true,
        status: 200,
        extras: { message: 'User updated' }
      }
    }
  })
  console.log(response);
  return (response)

}

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email })

  if (!user) {
    console.log('!user');
    return ({
      success: false,
      status: 203,
      extras: { message: 'User email does not exist' }
    })
  }
  let token = await Token.findOne({ userId: user._id })
  if (token) await token.deleteOne()
  let resetToken = crypto.randomBytes(32).toString("hex")
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt))

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save()

  const link = `${clientURL}/auth/resetPassword?token=${resetToken}&userId=${user._id}`
  sendEmail(user.email, "Password Reset Request", {
    name: user.name,
    link: link,
  }, "./template/requestResetPassword.handlebars")

  return ({
    success: true,
    status: 200,
    extras: {
      message: 'User founded and the link sent to email',
      link: link
    }
  })
}

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId })

  if (!passwordResetToken) {
    return ({
      success: false,
      status: 203,
      extras: 'Error getting informations'
    })
  }
  const isValid = await bcrypt.compare(token[1], passwordResetToken.token)
  console.log("isValid");
  console.log(isValid);
  if (!isValid) {
    return ({
      success: false,
      status: 203,
      extras: 'Invalid or expired password reset token'
    })
  }
  const hash = await crypto.createHash('md5').update(password).digest("hex")
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  )
  const user = await User.findById({ _id: userId })
  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      username: user.username,
    },
    "./template/resetPassword.handlebars"
  )
  await passwordResetToken.deleteOne()
  return true
}

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

const createTask = async (data) => {
  let response
  const task = new Task(data)
  try {
    await task.save()
    response = {
      success: true,
      status: 200,
      extras: { message: 'Task created' }
    }
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: {
        message: 'Cannot create a task',
        error: e
      }
    }
  }

  return (response)

}

const getAllTasks = async () => {
  let response
  await Task.find()
    .then(tasks => response = {
      success: true,
      status: 200,
      extras: {
        message: 'Getting all Tasks',
        tasks: tasks
      }
    })
    .catch(error => response = {
      success: false,
      status: 400,
      extras: { message: error }
    })
  return (response)
}

const deleteTask = async (name) => {
  console.log(name);
  let response
  try {
    let x = await Task.deleteOne({name : name})
    response = {
      success: true,
      status: 200,
      extras: { message: 'Task deleted' }
    }
    console.log(x);
  } catch (e) {
    response = {
      success: false,
      status: 417,
      extras: {
        message: 'Cannot delete a task',
        error: e
      }
    }
  }

  return (response)

}

module.exports = {
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
}
const JWT = require("jsonwebtoken")
const User = require("../models/User.model")
const Token = require("../models/Token.model")
const sendEmail = require("../utils/email/sendEmail")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const { response } = require("express")

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;



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
      // console.log(user)
      response = {
        success: true,
        status: 200,
        extras: { message: 'User found' }
      }
    }
  })
  return (response)
}

const signup = async (data) => {
  let user = await User.findOne({ email: data.email })
  if (user) {
    return ({
      success: false,
      status: 203,
      extras: 'Email already exist'
    })
  }
  user = new User(data);
  const token = JWT.sign({ id: user._id }, JWTSecret)
  await user.save()
  return (data = {
    userId: user._id,
    email: user.email,
    username: user.username,
    token: token,
  })
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
  },{
    email: body.newEmail,
    password : body.newPass
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
      // console.log(user)
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
    return ({
      success: false,
      status: 203,
      extras: 'User does not exist'
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
  return link
}

const resetPassword = async (userId, token, password) => {
  console.log(userId)
  console.log(token)
  console.log(password)
  let passwordResetToken = await Token.findOne({ userId })
  if (!passwordResetToken) {
    return ({
      success: false,
      status: 203,
      extras: 'Error getting informations'
    })
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token)
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



module.exports = {
  signin,
  signup,
  update,
  requestPasswordReset,
  resetPassword,
}
const {
  signin,
  signup,
  update,
  requestPasswordReset,
  resetPassword,
  profile,
} = require("../services/auth.service")



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
}
const {
  signin,
  signup,
  update,
  requestPasswordReset,
  resetPassword,
} = require("../services/auth.service")

const signInController = async (req, res, next) => {
  console.log('signInController');
  const signinService = await signin(
    req.body.email, 
    req.body.password
  )
  return res.status(signinService.status).json(signinService.extras)
}

const updateController = async (req, res, next) => {
  console.log('updateController');
  console.log(req.body);
  console.log(req.params.id);
  const updateService = await update(
    req.body,
    req.params.id
  )
  return res.status(updateService.status).json(updateService.extras)
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
    req.body.userId ,
    req.body.token ,
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
}
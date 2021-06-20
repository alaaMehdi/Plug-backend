const express = require('express')
const {
    signInController,
    signUpController,
    updateController,
    resetPasswordRequestController,
    resetPasswordController,
    createPollController,
    votePollController,
    getAllPollsController,
    createTaskController,
    getAllTasksController,
    deleteTaskController,
  } = require("../controllers/auth.controller")
const User = require('../models/user.model')
const router = express.Router()
const auth = require('../middleware/auth')

router.post("/auth/signIN", signInController);
router.post("/auth/signUP", signUpController);
router.post("/auth/requestResetPassword", resetPasswordRequestController);
router.post("/auth/resetPassword", resetPasswordController);

router.post("/createtask", createTaskController);
router.get("/tasks", getAllTasksController);
router.delete("/task/:name", deleteTaskController);

router.post("/createpoll", createPollController);
router.post("/vote", auth, votePollController);
router.get("/polls", getAllPollsController);

router.put('/auth/update/:id', updateController)

router.post('/signUP', (req, res) => {
    User.findOne({ email: req.body.email, phone: req.body.phone }, (err, user) => {
        if (err) {
            console.log(err)
            res.json(err).status(503)
        } else {
            if (req.body.email == undefined || req.body.email == '') {
                return res.status(417).json({
                    message: 'Email unvalide'
                })
            } else {
                if (req.body.fname == undefined || req.body.fname == '') {
                    return res.status(417).json({
                        message: 'First name unvalide'
                    })
                }
                else {
                    if (req.body.phone == undefined || req.body.phone == '') {
                        return res.status(417).json({
                            message: 'Phone unvalide'
                        })
                    }
                    else {
                        if (req.body.password == undefined || req.body.password == '') {
                            return res.status(417).json({
                                message: 'Password undefined'
                            })
                        } else {
                            if (user == null) {
                                const user = User({
                                    fname: req.body.fname,
                                    email: req.body.email,
                                    password: req.body.password,
                                    phone: req.body.phone
                                })
                                user.save()
                                    .then((err) => {
                                        if (err) {
                                            console.log(err)
                                            res.json(err).status(306)
                                        } else {
                                            console.log(user)
                                            res.json(user).status(201)
                                        }

                                    })
                            } else {
                                res.status(302).json({
                                    message: 'Email or phone already registred'
                                })
                            }
                        }
                    }
                }
            }
        }
    })
})

router.post('/signIN', (req, res) => {
    console.log('post signin');
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }, (err, user) => {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            if (user != null) {
                console.log(user)
                res.status(200).json(user)
            } else {
                console.log(user)
                res.status(203).json({
                    message: 'Email or passowrd incorrect'
                })
            }
        }
    })
})

module.exports = router

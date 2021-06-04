const User = require('../models/user.model')
function accountController(usermodel, session, mailer) {
  this.crypto = require('crypto');
  this.uuid = require('node-uuid');
  this.apiResponse = require('../models/api.response');
  this.apiMessages = require('../models/api.messages');
  this.userProfilemodel = require('../models/user.profile.model');
  this.usermodel = usermodel;
  this.session = session;
  this.mailer = mailer;
}

accountController.prototype.getSession = () => { return this.session }

accountController.prototype.setSession = (session) => { this.session = session }

accountController.prototype.hashPassword = (password, salt, callback) => {
  // we use pbkdf2 to hash and iterate 10k times by default 
  var iterations = 10,
    keylen = 64; // 64 bit.
  this.crypto.pbkdf2(password, salt, iterations, keylen, callback);
}

accountController.prototype.login = (req,res) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }, function (err, user) {

    if (err) {
      res.status(500).json(err)
    }

    if (user) {
      this.hashPassword(password, user.passwordsalt, function (err, passwordhash) {
        if (passwordhash == user.passwordhash) {
          var userProfilemodel = new this.userProfilemodel({
            email: user.email,
            username: user.username
          })

          this.session.userProfilemodel = userProfilemodel

          return callback(err, new this.apiResponse({
            success: true, extras: {
              userProfilemodel: userProfilemodel
            }
          }))
        } else {
          return callback(err, new this.apiResponse({
            success: false,
            extras: { msg: this.apiMessages.invalid_pwd }
          }))
        }
      })
    } else {
      return callback(err, new this.apiResponse({
        success: false,
        extras: { msg: this.apiMessages.email_not_found }
      }))
    }

  })
}

accountController.prototype.logout = () => {
  if (this.session.userProfilemodel) delete this.session.userProfilemodel
  return
}

accountController.prototype.signup = (newuser, callback) => {
  var me = this
  me.usermodel.findone({ email: newuser.email }, function (err, user) {

    if (err) {
      return callback(err, new me.apiResponse({
        success: false,
        extras: { msg: me.apiMessages.db_error }
      }))
    }

    if (user) {
      return callback(err, new me.apiResponse({
        success: false,
        extras: { msg: me.apiMessages.email_already_exists }
      }))
    } else {

      newuser.save(function (err, user, numberaffected) {

        if (err) {
          return callback(err, new me.apiResponse({
            success: false,
            extras: { msg: me.apiMessages.db_error }
          }));
        }

        if (numberaffected === 1) {

          var userProfilemodel = new me.userProfilemodel({
            email: user.email,
            lastname: user.lastname
          });

          return callback(err, new me.apiResponse({
            success: true, extras: {
              userProfilemodel: userProfilemodel
            }
          }))
        } else {
          return callback(err, new me.apiResponse({
            success: false,
            extras: { msg: me.apiMessages.could_not_create_user }
          }))
        }

      })
    }

  })
}

accountController.prototype.resetPassword = (email, callback) => {
  var me = this;
  me.usermodel.findone({ email: email }, function (err, user) {

    if (err) {
      return callback(err, new me.apiResponse({
        success: false,
        extras: { msg: me.apiMessages.db_error }
      }));
    }

    // save the user's email and a password reset hash in session. we will use
    var passwordresethash = me.uuid.v4()
    me.session.passwordresethash = passwordresethash
    me.session.emailwhorequestedpasswordreset = email

    me.mailer.sendpasswordresethash(email, passwordresethash)

    return callback(err, new me.apiResponse({
      success: true,
      extras: { passwordresethash: passwordresethash }
    }))
  })
}

accountController.prototype.resetPasswordFinal = (email, newpassword, passwordresethash, callback) => {
  var me = this;
  if (!me.session || !me.session.passwordresethash) {
    return callback(null, new me.apiResponse({
      success: false,
      extras: { msg: me.apiMessages.password_reset_expired }
    }))
  }

  if (me.session.passwordresethash !== passwordresethash) {
    return callback(null, new me.apiResponse({
      success: false,
      extras: { msg: me.apiMessages.password_reset_hash_mismatch }
    }))
  }

  if (me.session.emailwhorequestedpasswordreset !== email) {
    return callback(null, new me.apiResponse({
      success: false,
      extras: { msg: me.apiMessages.password_reset_email_mismatch }
    }))
  }

  var passwordsalt = this.uuid.v4()

  me.hashPassword(newpassword, passwordsalt, function (err, passwordhash) {

    me.usermodel.update({ email: email }, {
      passwordhash: passwordhash,
      passwordsalt: passwordsalt
    }, function (err, numberaffected, raw) {

      if (err) {
        return callback(err, new me.apiResponse({
          success: false,
          extras: { msg: me.apiMessages.db_error }
        }))
      }

      if (numberaffected < 1) {

        return callback(err, new me.apiResponse({
          success: false,
          extras: { msg: me.apiMessages.could_not_reset_password }
        }))
      } else {
        return callback(err, new me.apiResponse({
          success: true,
          extras: null
        }))
      }
    })
  })
};

module.exports = accountController
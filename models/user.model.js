const crypto = require("crypto")
const mongoose = require('mongoose')
const {Schema} = mongoose
mongoose.Promise = global.Promise



const userSchema = new Schema({

    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },

    password: { type: String },

  },{
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  const hash = await crypto.createHash('md5').update(this.password).digest("hex")
  this.password = hash
  next()
});


module.exports = mongoose.models.User || mongoose.model('User', userSchema)
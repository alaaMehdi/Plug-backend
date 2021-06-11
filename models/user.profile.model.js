const mongoose = require('mongoose')
const { Schema } = mongoose
mongoose.Promise = global.Promise



const userProfileSchema = new Schema({

  firstname: {
    type: String,
    trim: true,
    required: true,
  },

  familyname: {
    type: String,
    trim: true,
    required: true,
  },

  birthday: {
    type: Date,
    trim: true,
    required: true,
  },

  profileimg: {
    data: Buffer, 
    contentType: String
  }

}, {
  timestamps: true,
}
)

module.exports = mongoose.models.Profile || mongoose.model('Profile', userProfileSchema)
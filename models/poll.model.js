const mongoose = require('mongoose')
const { Schema } = mongoose
mongoose.Promise = global.Promise



const pollSchema = new Schema({

  title: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  creator: {
    type: String,
    trim: true,
  },

  usersWhoVoted: {
    type: [String],
    trim: true,
  },

  options: {
    type: Schema.Types.Mixed,
    trim: true,
    required: true,
  }
  

}, {
  timestamps: true,
}
)


module.exports = mongoose.model('Poll', pollSchema)
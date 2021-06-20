const mongoose = require('mongoose')
const { Schema } = mongoose
mongoose.Promise = global.Promise



const taskSchema = new Schema({

  name: {
    type: String,
    trim: true,
    unique: true,
  },

  isDone: {
    type: Boolean,
    trim: true,
  },

}, {
  timestamps: true,
}
)


module.exports = mongoose.model('Task', taskSchema)
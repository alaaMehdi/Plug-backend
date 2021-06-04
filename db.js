const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL

module.exports = async function connection() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    },(error) => {
      if (error) return Error("Failed to connect to database")
      console.log("connected")
    })
  } catch (e) {
    console.log(e)
  }
}

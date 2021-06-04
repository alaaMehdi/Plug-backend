require("express-async-errors")
require("dotenv").config()

const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
const cors = require('cors')
const connection = require("./db")

    (async function db() {
        await connection();
    })

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', require('./routes/user.route'))

app.listen(port, () => {
    console.log('port running on ' + port)
})

module.exports = app
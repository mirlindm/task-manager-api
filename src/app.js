const express = require('express')
require('./db/mongoose') // to get the connectivity to the database
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Task = require('./models/task') 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
//const port = process.env.PORT // port for both Heroku and our localhost

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app


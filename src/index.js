const express = require('express')
require('./db/mongoose') // to get the connectivity to the database
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/user') // User Model
const Task = require('./models/task') // Task Model
const { response } = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT // port for both Heroku and our localhost

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


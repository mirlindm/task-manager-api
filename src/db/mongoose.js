const mongoose = require('mongoose')
//const validator = require('validator')

// Connect mongoose to the database. We will use a new database instead of the task-manager db
// This file only serves to connect to the database and create the new database
//'mongodb://127.0.0.1:27017/task-manager-api'
mongoose.connect((process.env.MONGODB_URL), {
    useUnifiedTopology: true,
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false
})

// const me = new User({
//     name: '  Anton  ',
//     age: 24,
//     email: 'MYEMAIL@outlook.COM  ',
//     password: '   myPassword123     '
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error)=> {
//     console.log('Error: ', error)
// })


// instantiates an object of the newly created model Tasks
// const newTask = new Task({
//     description: '       This is my fisrt Mongoose validated task!',
// })

// // saves the new object in the database
// newTask.save().then(() => {
//     console.log(newTask)
// }).catch((error) => {
//     console.log('Error: ', error)
// })
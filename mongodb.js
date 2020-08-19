// CRUD create read update delete

// const mongodb = require('mongodb')       // installing mongodb library
// const MongoClient = mongodb.MongoClient  // we need this to access the functionalities to perform CRUD operations
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb') // shorthand for the above three lines

const connectionURL = 'mongodb://127.0.0.1:27017' // we will use full IP instead of localhost, as localhost casues issues and makes the app slower
const databaseName = 'task-manager'  // database name

const id = new ObjectID()
console.log(id.id.length)
console.log(id.getTimestamp())
console.log(id.toHexString().length)


MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {    // { useUnifiedTopology: true } or {useNewUrlParser: true}
    if(error) {
        return console.log('Unable to connect to database!')
    }
    const db = client.db(databaseName)    //using db method on client to get the connection to the specific database
    
    // // querying or fetching ONE user's data from the database using some filters
    // db.collection('users').findOne({ _id: new ObjectID("5f30271f255b461a84f99b2d") }, (error, user) => {
    //     if (error){
    //         return console.log('Unable to find user!')
    //     }
    //     console.log(user)
    // })

    // // fetching more users with find() method
    // db.collection('users').find({age: 25}).toArray((error, users) => {
    //     console.log(users)
    // })

    // // fetching back the number or count of users that match the filter
    // db.collection('users').find({age: 25}).count((error, count) => {
    //     console.log(count)
    // })

    // // fetch last task by its id
    // db.collection('tasks').findOne({ _id: new ObjectID("5f300971d0269827483be249")}, (error, task) => {
    //     if(error){
    //         return console.log('Unable to find the task!')
    //     }
    //     console.log(task)
    // })

    // // fetch all incompleted tasks:
    // db.collection('tasks').find({completed: false}).toArray( (error, taskList) => {
    //     if(error){
    //         return console.log('Unable to find the tasks!')
    //     }
    //     console.log(taskList)
    // })


    // Updating documents 

    // // Update one document using updateOne()
    // db.collection('users').updateOne({ _id: new ObjectID("5f30069730a50e3cc814fc1a")
    //     },  
    //     {
    //         // in this second argument, we are doing the actual update
    //         $inc: {
    //             age: 3
    //         }
    //     }).then((result) => {
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    
    //     // Update many documents using updateMany()
    //     db.collection('tasks').updateMany({
    //         completed: false
    //     }, {
    //         $set: {
    //             completed: true
    //         }
    //     }
    //     ).then((result) => {
    //         console.log(result.modifiedCount) 
    //     }).catch((error)=>{
    //         console.log(error)
    //     })

    db.collection('users').deleteMany({ 
        age: 27
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    db.collection('tasks').deleteOne({
        description: 'This is the third task'
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })

})

const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


// endpoint to create a new task
router.post('/tasks', auth,  async (req, res) => {
    //const task = new Task(req.body)  // old solution
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save() 
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }


    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

// endpoint to read/get all tasks
// Get /tasks?completed=true||false
// Pagination: limit & skip : GET /tasks?limit=10&skip=0
// Sorting: GET /tasks?sortBy=createdAt_asc_desc (:asc:desc)
router.get('/tasks', auth,  async (req, res) => {
    const match = {}
    const sort = {}
    
    if(req.query.completed){
        match.completed = req.query.completed === 'true' // return all the tasks based on the query parameter
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
    
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

// endpoint to get a task by its id
router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id })
        
        if(!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send('Task not found')
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})


// update a task by its id, using async and await
router.patch('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
     
    if(!isValidOperation){
        res.status(400).send('Invalid Updates')
    }

    try {
        // changing the way we update the task (also the user in the other file), in order to take advantage of the middleware methods for doing something (in this case, hashing the password) just before a user or task is saved (created or updated)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        //const task = await Task.findById(id)
             
        //const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})  // old way

        if(!task) {
           return  res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()  

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// delete a task by its id, using async and await
router.delete('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        // await task.remove() if we use Task.findOne()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router
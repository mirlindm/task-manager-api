const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()


// endpoint to create a new user or sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name) 
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
    
    // old code
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error) // setting the status code should always come before sending the error message!
    // })
})

// endpoint for users to login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)   // findByCredentials() is a custom made function in the User model
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// endpoint to logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// endpoint to logout of all sessions/tokens
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        send.status(500).send()
    }
})

// endpoint to read/get multiple users
router.get('/users/me', auth,  async (req, res) => {
    res.send(req.user)

    // try {
    //     const users = await User.find({}) 
    //     res.send(users)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
    
    // User.find({}).then((users) => {
    //     res.send(users) // .status(200) is by default here, we do not need to provide them
    // }).catch((error) => {
    //     res.status(500).send() // something went wrong in the backend, hence status code of 500
    // })
})


// Update a user by his/her id, using async and await
router.patch('/users/me', auth,  async (req, res) => {
    //const id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        //const user = await User.findById(id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true})

        // if(!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)  // only taking care of validation errors, not server side errors
    }
})

// delete a user by his/her id, using async and await
router.delete('/users/me', auth,  async (req, res) => {
    //const id = req.params._id
    try {
        // const user = await User.findByIdAndDelete(id)
        // if(!user){
        //     return res.status(404).send()
        //}
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e) // here we use 500, cause there can only be errors from the server, not any validation errors
    }
})

const uploadAvatar = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => res.status(400).send({error: error.message}))


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined // deleting or clearing the avatar field from the database
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(404).send()
    }
})


module.exports = router
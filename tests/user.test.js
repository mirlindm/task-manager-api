// Testing user functionalities for our task app
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')




// before each test case in the test suite. Runs a single time 
beforeEach(setupDatabase)


// afterEach(() => {
//     console.log('After each')
// })

test('Should sign up a new user', async () => {
    const response = await request(app)
    .post('/users')
    .send({
        name: 'Mirlind',
        email: 'mirlind@test.com',
        password: 'MyPass777!'
        })
    .expect(201)


    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    //expect(response.body.user.name).toBe('Mirlind')
    expect(response.body).toMatchObject({
        user: {
            name: 'Mirlind',
            email: 'mirlind@test.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
}) 

// login with success
test('Should login existing user', async () => {
   const response = await request(app)
        .post('/users/login')
        .send({
                email: userOne.email,
                password: userOne.password
            })
        .expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
    // expect(response.body).toMatchObject({
    //     token: user.tokens[1].token
    // })
})

// login with failure
test('Should not login with bad credentials', async () => {
    await request(app)
    .post('/users/login')
    .send({
            email: userOne.email,
            password: 'notmypass123'
        })
    .expect(400)
})

// testing the endpoint of fetching user's profile with success
test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

// testing the endpoint of fetching user's profile with failure
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

// testing the endpoint of deleting the user's profile with success
test('Should delete profile for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    // Assertion to check if the user was successfully deleted
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})


// testing the endpoint of deleting the user's profile with failure
test('Should delete profile for user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

    // toBe() makes use of the tripe equal sign === 
})

// Testing the endpoint to update a user's profile with Success
test('Should update valid user fields', async () => {
    const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Mirlind Murati'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Mirlind Murati') // or toEqual()
})

// Testing the endpoint to update a user's profile with Failure
test('Should update invalid user fields', async () => {
    const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
       location: 'Tartu'
    })
    .expect(400)
})
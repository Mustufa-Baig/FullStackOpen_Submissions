const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

initialUsers = [
  {
    "username":"user1",
    "name":"alice",
    "passwordHash":"$2b$10$8UU2xkl.LH5EnPQVu3V1eOl2m8e90nxafHtllGJzHb6wv8MHvBoPS"
  },
  {
    "username":"user2",
    "name":"bob",
    "passwordHash":"$2b$10$LUPA5Br0IZxRnNbYb0WyFeIIgTDJWyy0x6jl9kD33JB4YBiUfODIC"
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

test('initial user list', async () => {
  const response = await api.get('/api/users')
  assert(response.body[0].id !== undefined)
})

test('posting a user adds them to the database', async () => {
  const newUser = {
    "username":"user3",
    "name":"charlie",
    "password":"strong_password"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const response = await api.get('/api/users')

  assert.strictEqual(response.body.length, initialUsers.length+1 )
  assert(
    response.body.some( user => user.username == newUser.username )
  )
})

test('username of new user must be unique', async () => {
  const newUser = {
    "username":"user2",
    "name":"charlie",
    "password":"strong_password"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('username of new user must be at least 3 characters long', async () => {
  const newUser = {
    "username":"u3",
    "name":"charlie",
    "password":"strong_password"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('password of new user must be at least 3 characters long', async () => {
  const newUser = {
    "username":"user3",
    "name":"charlie",
    "password":"pw"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
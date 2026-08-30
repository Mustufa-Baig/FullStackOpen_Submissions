const { test, after, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let Token = ''

let initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: ''
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: ''
  }
]

before(async () => {
  await User.deleteMany({})

  let newUser = await api
    .post('/api/users')
    .send({
      username:"user1",
      name:"alice",
      password:"password1"
    })
  
  const response = await api
    .post('/api/login')
    .send({
      username:"user1",
      password:"password1"
    })

  Token = response.body.token
  initialBlogs[0].user = newUser.body.id
  initialBlogs[1].user = newUser.body.id
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].id !== undefined)
})

test('posting a blog adds it to the database', async () => {
  const newBlog = {
    title: "Hello world",
    author: "John doe",
    url: "https://example.com",
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${Token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length+1 )
  assert(
    response.body.some( blog =>
      blog.title == newBlog.title &&
      blog.author == newBlog.author &&
      blog.url == newBlog.url &&
      blog.likes == newBlog.likes
    )
  )
})

test('posting a blog with missing likes, defaults to 0 likes', async () => {
  const newBlog = {
    title: "Hello world",
    author: "John doe",
    url: "https://example.com"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${Token}`)
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length+1 )
  assert(
    response.body.some( blog =>
      blog.title == newBlog.title &&
      blog.author == newBlog.author &&
      blog.url == newBlog.url &&
      blog.likes == 0
    )
  )
})



test('posting a blog with missing Token gets rejected', async () => {
  const newBlog = {
    title: "Hello world",
    author: "John doe",
    url: "https://example.com",
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer `)
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})


test('posting a blog with missing title gets rejected', async () => {
  const newBlog = {
    author: "John doe",
    url: "https://example.com",
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${Token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('posting a blog with missing url gets rejected', async () => {
  const newBlog = {
    title: "Hello world",
    author: "John doe",
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${Token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})


test('sending a delete request, removes that blog from the database', async () => {
  const response = await api.get('/api/blogs')
  await api
    .delete('/api/blogs/'+response.body[0].id)
    .set('Authorization', `Bearer ${Token}`)
    .expect(204)

  const second = await api.get('/api/blogs')

  assert.strictEqual(response.body.length-1, second.body.length)
})

test('delete request of non existing id gives 404', async () => {
  await api
    .delete('/api/blogs/6a91f74aa41cedbe34b85fe4')
    .set('Authorization', `Bearer ${Token}`)
    .expect(404)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})


test('delete request of invalid id gives 400', async () => {
  await api
    .delete('/api/blogs/helloworld')
    .set('Authorization', `Bearer ${Token}`)
    .expect(400)


  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})




test('likes of a blog can be updated with its id', async () => {
  const response = await api.get('/api/blogs')
  await api
    .put('/api/blogs/'+response.body[0].id)
    .set('Authorization', `Bearer ${Token}`)
    .send({ likes: 42 })
    .expect(200)

  const second = await api.get('/api/blogs')

  assert.strictEqual(second.body[0].likes, 42)
})

test('updating a blog with non existing id gives 404', async () => {
  await api
    .put('/api/blogs/6a91f74aa41cedbe34b85fe4')
    .set('Authorization', `Bearer ${Token}`)
    .send({ likes: 42 })
    .expect(404)
})

test('updating a blog with invalid id gives 400', async () => {
  await api
    .put('/api/blogs/helloworld')
    .set('Authorization', `Bearer ${Token}`)
    .send({ likes: 42 })
    .expect(400)
})


test('updating a blog without providing likes gives 400', async () => {
  const response = await api.get('/api/blogs')
  await api
    .put('/api/blogs/'+response.body[0].id)
    .set('Authorization', `Bearer ${Token}`)
    .send({ })
    .expect(400)
})


after(async () => {
  await mongoose.connection.close()
})
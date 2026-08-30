const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name:1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  try{
    const body = request.body
    const user = await User.findById(request.user)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({ 
      title: body.title, 
      author: body.author, 
      url: body.url, 
      likes: body.likes, 
      user: user._id
    })

    const result = await blog.save()


    user.blogs = user.blogs.concat(result.id)
    await user.save()

    return response.status(201).json(result)
  } catch(error) {
    return response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  try{
    const user = await User.findById(request.user)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const selected = await Blog.findById(request.params.id)

    if (!selected) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if(selected.user.toString()!==user.id.toString()){
      return response.status(403).json({ error: 'given Blog does not belong to User' })
    }

    await Blog.findByIdAndDelete(request.params.id)

    user.blogs = user.blogs.filter(
      blogId => blogId.toString() !== request.params.id
    )
    await user.save()


    return response.status(204).end()
  } catch(error) {
    return response.status(400).json({ error: error.message })
  }
})


blogsRouter.put('/:id', userExtractor, async (request, response) => {
  try{
    const user = await User.findById(request.user)

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const selected = await Blog.findById(request.params.id)

    if (!selected) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if(selected.user.toString()!==user.id.toString()){
      return response.status(403).json({ error: 'given Blog does not belong to User' })
    }

    if (request.body.likes === undefined){
      return response.status(400).json({ error: 'missing `likes` in request' })
    }
    
    selected.likes = request.body.likes

    const updated = await selected.save()

    return response.status(200).json(updated)

  } catch(error) {
    return response.status(400).json({ error: error.message })
  }
})




module.exports = blogsRouter
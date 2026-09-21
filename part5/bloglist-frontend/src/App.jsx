import { useState, useEffect } from 'react'
import {
  Routes, Route, Link,
  useNavigate, useMatch
} from 'react-router-dom'

import { Container, AppBar, Toolbar, Button, Box, Typography } from '@mui/material'

import Login from './components/Login'
import NewBlogForm from './components/NewBlogForm'
import Blog from './components/Blog'
import BlogsList from './components/BlogsList'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  const [user, setUser] = useState(null)
  const [message, setmessage] = useState({ text:null, success:null })

  const navigate = useNavigate()
  const matchBlog = useMatch('/blogs/:id')
  const selectedBlog = matchBlog 
    ? blogs.find(blog => blog.id == matchBlog.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])




  const handleLogin = (credentials) => {
    loginService
      .login(credentials)
      .then(user => {
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
        navigate('/')
      })
      .catch(error => {
        console.log(error.response.data.error)
        setmessage({ text:'wrong username or password', success:'error' })
        setTimeout(() => {
          setmessage({ text:null, success:null })
        }, 3000)
      })
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    navigate('/')
  }

  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          navigate('/')
        })
        .catch(error => {
          console.log(error.response.data.error)
        })
    }
  }

  const handleCreate = (newBlog) => {
    blogService
      .create(newBlog)
      .then(blog => {
        setBlogs(blogs.concat(blog))

        setmessage({ text:`a new blog by ${blog.author}: ${blog.title} added`, success:"success" })
        setTimeout(() => {
          setmessage({ text:null, success:null })
        }, 3000)

        navigate('/')
      })
      .catch(error => {
        const err = error.response.data.error
        if (err.includes('validation failed')){
          if (err.includes('title') || err.includes('url')){
            setmessage({ text:'Title and URL required', success:'error' })
            setTimeout(() => {
              setmessage({ text:null, success:null })
            }, 3000)
          }
          else{
            console.log('validation failed')
          }
        }
      })
  }

  const addLike = id => {
    const blog = blogs.find(b => b.id === id)
    blogService
      .update(blog.id, {
        user: blog.user.id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1
      })
      .then(newBlog => {
        setBlogs(blogs.map(blog => (blog.id !== id ? blog : newBlog)))
      })
      .catch(error => {
        console.log(error.response.data.error)
      })
  }

  const toolbarHover = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Blogs App</Typography>
          <Box sx={{ flexGrow: 1 }}/>
          <Button color="inherit" component={Link} to="/" sx={toolbarHover}>blogs</Button>
          { user && <Button color="inherit" component={Link} to="/create" sx={toolbarHover}>new blog</Button> }
          { user ? <Button color="inherit" onClick={handleLogout} sx={toolbarHover}>logout</Button> : <Button color="inherit" component={Link} to="/login" sx={toolbarHover}>login</Button> }
        </Toolbar>
      </AppBar>


      <Routes>
        <Route path="/" element={
          <BlogsList blogs={blogs} message={message} />
        } />
        <Route path="/login" element={
          <Login message={message} handleLogin={handleLogin} />
        } />
        { user && <Route path="/create" element={
          <NewBlogForm handleCreate={handleCreate} />
        } /> }
        
        <Route path="/blogs/:id" element={
          <Blog blog={selectedBlog}  user={user} addLike={()=>addLike(selectedBlog.id)} deleteBlog={()=>deleteBlog(selectedBlog.id)} />
        } />
      </Routes>
    </Container>
  )
}

export default App
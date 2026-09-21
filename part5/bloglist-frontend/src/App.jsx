import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Create from './components/Create'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setmessage] = useState({ text:null, success:null })

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

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setUsername('')
    setPassword('')
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.log(error.response.data.error)
      setmessage({ text:'wrong username or password', success:false })
      setTimeout(() => {
        setmessage({ text:null, success:null })
      }, 3000)
    }
  }


  if (user===null){
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification text={message.text} success={message.success} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }


  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
        .catch(error => {
          console.log(error.response.data.error)
        })
    }
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

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>

      <Notification text={message.text} success={message.success} />

      <p>{user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Create setmessage={setmessage} blogService={blogService} setBlogs={setBlogs} blogs={blogs} />

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog}  user={user} addLike={()=>addLike(blog.id)} deleteBlog={()=>deleteBlog(blog.id)} />
      )}
    </div>
  )
}

export default App
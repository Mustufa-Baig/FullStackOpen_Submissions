import { useState } from 'react'
import './Blog.css'

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  const [expandView, setExpandView] = useState(false)

  const deleteButton = {
    display: blog.user.username===user.username ? '' : 'none',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px'
  }

  if (!expandView){
    return(
      <div className='blog'>
        <span>{blog.title} {blog.author}</span>
        <button onClick={() => setExpandView(true) }>view</button>
      </div>
    )
  }

  return(
    <div className='blog'>
      <span>{blog.title} {blog.author}</span>
      <button onClick={() => setExpandView(false) }>hide</button>
      <div>{blog.url}</div>
      <div>likes {blog.likes} <button onClick={addLike}>like</button> </div>
      <div>{blog.user.name}</div>
      <button style={deleteButton} onClick={deleteBlog}>remove</button>
    </div>
  )

}

export default Blog
import Notification from './Notification'
import { Link } from 'react-router-dom'

const BlogsList = ({ blogs ,message }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return(
    <div>
      <h2>blogs</h2>
      <Notification text={message.text} success={message.success} />

      <ul>
        {sortedBlogs.map(blog =>
          <li key={blog.id} >
            <Link to={`/blogs/${blog.id}`}>{ blog.title } by { blog.author }</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default BlogsList
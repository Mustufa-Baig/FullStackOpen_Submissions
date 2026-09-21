import { useState } from 'react'
import NewBlogForm from './NewBlogForm'

const Create = ({ setmessage ,blogService ,setBlogs, blogs }) => {
  const [createVisible, setCreateVisible] = useState(false)

  const hideWhenVisible = { display: createVisible ? 'none' : '' }
  const showWhenVisible = { display: createVisible ? '' : 'none' }


  const handleCreate = (newBlog) => {
    blogService
      .create(newBlog)
      .then(blog => {
        setBlogs(blogs.concat(blog))
        setCreateVisible(false)

        setmessage({ text:`a new blog ${blog.title} by ${blog.author} added`, success:true })
        setTimeout(() => {
          setmessage({ text:null, success:null })
        }, 3000)
      })
      .catch(error => {
        const err = error.response.data.error
        if (err.includes('validation failed')){
          if (err.includes('title') || err.includes('url')){
            setmessage({ text:'Title and URL required', success:false })
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


  return(
    <>
      <div style={hideWhenVisible}>
        <button onClick={() => setCreateVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <NewBlogForm handleCreate={handleCreate} />
        <button onClick={() => setCreateVisible(false)}>cancel</button>
      </div>
    </>
  )
}

export default Create
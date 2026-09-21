import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const NewBlogForm = ({ handleCreate }) =>{
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleCreate({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return(
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
              label='title:'
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          
        </div>
        <div>
          <TextField
              label='author:'
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          
        </div>
        <div>
          <TextField
              label='url:'
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
        </div>
        <Button type="submit" variant="contained">create</Button>
      </form>
    </>
  )
}

export default NewBlogForm
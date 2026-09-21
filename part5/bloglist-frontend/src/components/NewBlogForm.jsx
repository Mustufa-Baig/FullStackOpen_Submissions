import { useState } from 'react'

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
          <label>
            title:
            <input
              type="text"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default NewBlogForm
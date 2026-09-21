import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders Title and Author, but not URL or Likes', () => {
  const accessUser = {
      id: 'exampleUserID',
      username: 'john_d',
      name: 'john'
  }
  const blog = {
    user: accessUser,
    title: 'Hello World',
    author: 'John Doe',
    url: 'example.com',
    likes: 42
  }

  render(<Blog blog={blog} user={accessUser} />)

  const titleAuthor = screen.getByText('Hello World John Doe')
  expect(titleAuthor).toBeDefined()

  const url = screen.queryByText('example.com')
  const likes = screen.queryByText('likes 42')

  expect(url).toBeNull()
  expect(likes).toBeNull()
})


test('clicking the view button expands the details of the blog', async () => {
  const accessUser = {
      id: 'exampleUserID',
      username: 'john_d',
      name: 'john'
  }
  const blog = {
    user: accessUser,
    title: 'Hello World',
    author: 'John Doe',
    url: 'example.com',
    likes: 42
  }

  render(<Blog blog={blog} user={accessUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('example.com')
  const likes = screen.getByText('likes 42')
  
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})



test('clicking the like button twice calls the event handler twice', async () => {
  const accessUser = {
      id: 'exampleUserID',
      username: 'john_d',
      name: 'john'
  }
  const blog = {
    user: accessUser,
    title: 'Hello World',
    author: 'John Doe',
    url: 'example.com',
    likes: 42
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={accessUser} addLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)


  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})


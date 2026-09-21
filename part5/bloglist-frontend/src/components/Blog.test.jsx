import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders Blog info to unauthenticated users, but not buttons', () => {
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

  render(<Blog blog={blog} user={null} />)

  const title = screen.getByText('Hello World')
  const author = screen.getByText('by John Doe')
  const url = screen.getByText('example.com')
  const likes = screen.getByText('42 likes')

  const likeButton = screen.queryByText('like')
  const deleteButton = screen.queryByText('remove')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()

  expect(likeButton).toBeNull()
  expect(deleteButton).toBeNull()
})


test('authenticated users who are not the blogs creator are only shown the like button', async () => {
  const accessUser = {
      id: 'exampleUserID',
      username: 'john_d',
      name: 'john'
  }
  const blogCreator = {
      id: 'UserIDexample',
      username: 'alice',
      name: 'alice'
  }
  const blog = {
    user: blogCreator,
    title: 'Hello World',
    author: 'John Doe',
    url: 'example.com',
    likes: 42
  }

  render(<Blog blog={blog} user={accessUser} />)

  const user = userEvent.setup()

  const likeButton = screen.getByText('like')
  const deleteButton = screen.queryByText('remove')

  expect(likeButton).toBeDefined()
  expect(deleteButton).toBeNull()
})


test('the blogs creator is shown both the like button and delete button', async () => {
  const blogCreator = {
      id: 'UserIDexample',
      username: 'alice',
      name: 'alice'
  }
  const blog = {
    user: blogCreator,
    title: 'Hello World',
    author: 'John Doe',
    url: 'example.com',
    likes: 42
  }

  render(<Blog blog={blog} user={blogCreator} />)

  const user = userEvent.setup()

  const likeButton = screen.getByText('like')
  const deleteButton = screen.getByText('remove')

  expect(likeButton).toBeDefined()
  expect(deleteButton).toBeDefined()
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

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})


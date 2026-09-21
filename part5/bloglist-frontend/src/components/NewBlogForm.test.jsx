import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('new blog form is filled with the right details', async () => {

  const createBlog = vi.fn()
  render(<NewBlogForm  handleCreate={createBlog} />)

  const user = userEvent.setup()

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const createButton = screen.getByText('create')

  await user.type(title, 'Hello World')
  await user.type(author, 'John Doe')
  await user.type(url, 'example.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Hello World')
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('example.com')
})
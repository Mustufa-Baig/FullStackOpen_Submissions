const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Alice',
        username: 'user1',
        password: 'password1'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Bob',
        username: 'user2',
        password: 'password2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'user1', 'password1')
      await expect(page.getByText('logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'user1', 'wrong_password')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'user1', 'password1')
      await expect(page.getByText('logout')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Hello world', 'John Doe', 'example.com')

      await expect(page.getByText('Hello world by John Doe')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Hello world', 'John Doe', 'example.com')
      })
  
      test('it can be liked', async ({ page }) => {
        await page.getByText('Hello world by John Doe').click()
        
        await expect(page.getByText('0 likes')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('1 likes')).toBeVisible()
      })

      test('it can be deleted by its user', async ({ page }) => {
        await page.getByText('Hello world by John Doe').click()

        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toBe('Remove blog Hello world by John Doe?')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('Hello world John Doe')).not.toBeVisible()
      })

      test('it cannot be deleted by its another user', async ({ page }) => {
        await loginWith(page, 'user2', 'password2')

        await page.getByText('Hello world by John Doe').click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
        await createBlog(page, 'Go To Statement Considered Harmful', 'Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
        await createBlog(page, 'TDD harms architecture', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html')
      })

      test('blogs are arranged sorted by likes', async ({ page }) => {
        await await page.getByText('React patterns by Michael Chan').click()
        await likeBlog(page, 3)
        await page.goto('http://localhost:5173')
        
        await await page.getByText('Go To Statement Considered Harmful by Edsger W. Dijkstra').click()
        await likeBlog(page, 5)
        await page.goto('http://localhost:5173')
        
        await await page.getByText('TDD harms architecture by Robert C. Martin').click()
        await likeBlog(page, 7)
        await page.goto('http://localhost:5173')
        
        await expect(page.getByText('React patterns by Michael Chan')).toBeVisible()

        await expect(await page.locator('ul').allTextContents()).toEqual([
          'TDD harms architecture by Robert C. Martin'+
          'Go To Statement Considered Harmful by Edsger W. Dijkstra'+
          'React patterns by Michael Chan'
        ])
      })
    })
  })
})
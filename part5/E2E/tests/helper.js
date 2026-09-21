import { expect } from '@playwright/test';

const loginWith = async (page, username, password)  => {
  await page.goto('http://localhost:5173/login')

  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.goto('http://localhost:5173/create')

  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await expect(page.getByText(`${title} by ${author}`)).toBeVisible()
}

const likeBlog = async (page, count) => {
  for (let i = 1; i <= count; i++) {
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText(`${i} likes`)).toBeVisible()
  }
}


export { loginWith, createBlog, likeBlog }
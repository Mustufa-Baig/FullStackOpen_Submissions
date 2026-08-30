const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
]

const equalBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 7,
    __v: 0
  },
  {
    _id: "51b54a6765a422a8234d17f7",
    title: "patterns React",
    author: "Michael Chan",
    url: "https://patternsreact.com/",
    likes: 7,
    __v: 0
  }
]


const sample_blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('dummy', ()=>{
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list is empty, likes equal zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has many blogs, likes are total', () => {
    const result = listHelper.totalLikes(sample_blogs)
    assert.strictEqual(result, 36)
  })
})


describe('favorite blog', () => {
  test('when list is empty, favorite blog is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result,null)
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.strictEqual(result,listWithOneBlog[0])
  })

  test('when list has many blogs, favorite is blog with most likes', () => {
    const result = listHelper.favoriteBlog(sample_blogs)
    const actual = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
    assert.deepStrictEqual(result, actual)
  })

  test('when mulitple blogs share max likes, any one of them is favorite', () => {
    const result = listHelper.favoriteBlog(equalBlogs)
    assert(equalBlogs.slice(0, 2).includes(result))
  })
})

describe('most blogs', () => {
  test('when list is empty, most blog author is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result,null)
  })

  test('when list has many authors, most blogs author is selected', () => {
    const result = listHelper.mostBlogs(sample_blogs)
    const actual = {
      author: "Robert C. Martin",
      blogs: 3
    }
    assert.deepStrictEqual(result, actual)
  })

  test('when many authors have same blog count, any one of them is selected', () => {
    const result = listHelper.mostBlogs(equalBlogs)
    const actual = [
      {
        author: 'Michael Chan',
        blogs: 2
      },
      {
        author: 'Edsger W. Dijkstra',
        blogs: 2
      }
    ]
    assert(
      actual.some(blog =>
        blog.author === result.author &&
        blog.blogs === result.blogs
      )
    )
  })
})


describe('most likes', () => {
  test('when list is empty, most liked author is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result,null)
  })

  test('when list has many authors, most liked author is selected', () => {
    const result = listHelper.mostLikes(sample_blogs)
    const actual = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    assert.deepStrictEqual(result, actual)
  })

  test('when many authors have same likes, any one of them is selected', () => {
    const result = listHelper.mostLikes(equalBlogs)
    const actual = [
      {
        author: 'Michael Chan',
        likes: 17
      },
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    ]
    assert(
      actual.some(blog =>
        blog.author === result.author &&
        blog.likes === result.likes
      )
    )
  })
})
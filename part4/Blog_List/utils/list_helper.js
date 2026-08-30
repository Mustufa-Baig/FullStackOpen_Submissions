const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	let likes = 0
	blogs.forEach(blog => likes+= blog.likes)
	return likes
}

const favoriteBlog = (blogs) => {
	if (!blogs || blogs.length==0) return null

	let favorite = blogs[0]
	blogs.forEach(blog => {
		if (blog.likes > favorite.likes) favorite = blog
	})
	return favorite
}

const mostBlogs = (blogs) => {
	if (!blogs || blogs.length==0) return null

	authors = []
	blogs.forEach(blog => {
		a = authors.find(person => person.author === blog.author)
		if (a) {
			a.blogs++
		}
		else {
			authors = [ {author:blog.author , blogs:1} , ...authors ]
		}
	})
	authors.sort((a, b) => b.blogs - a.blogs);

	return authors[0]
}

const mostLikes = (blogs) => {
	if (!blogs || blogs.length==0) return null

	authors = []
	blogs.forEach(blog => {
		a = authors.find(person => person.author === blog.author)
		if (a) {
			a.likes += blog.likes
		}
		else {
			authors = [ {author:blog.author , likes:blog.likes} , ...authors ]
		}
	})
	authors.sort((a, b) => b.likes - a.likes);

	return authors[0]
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}
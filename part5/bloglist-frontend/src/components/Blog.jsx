import { useState } from 'react'
import { Button, Box, Typography, Link, Stack } from '@mui/material'

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  if (!blog) {
    return null
  }

  return(
    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Stack spacing={2}>
        <Typography variant="h4">{blog.title}</Typography>
        <Typography variant="body1" sx={{ color: 'grey.700' }}>by {blog.author}</Typography>
        <Link href={blog.url}>{blog.url}</Link>
        <Typography variant="body1" sx={{ color: 'grey.700' }}>Added by {blog.user.name}</Typography>

        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-start", alignItems: "center" }}>
          <Typography variant="subtitle1">{blog.likes} likes</Typography>
          { user && <Button variant="outlined" onClick={addLike}>like</Button> }
          { user && blog.user.username===user.username && <Button variant="outlined" color="error" onClick={deleteBlog}>remove</Button> }
        </Stack>
      </Stack>
    </Box>
  )

}

export default Blog
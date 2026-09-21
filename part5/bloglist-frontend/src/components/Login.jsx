import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import Notification from './Notification'

const Login = ({ message ,handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginUser = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>

      <Notification text={message.text} success={message.success} />
      <form onSubmit={loginUser}>
        <div>
          <TextField
              label='username'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          <TextField
              label='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <Button type="submit" variant="contained">login</Button>
      </form>
    </div>
  )
}

export default Login
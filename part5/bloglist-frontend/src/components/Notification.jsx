import { Alert } from '@mui/material'

const Notification = ({ text, success }) => {
  if (text===null){
    return null
  }
  return (
    <Alert severity={success}>{text}</Alert>
  )
}

export default Notification
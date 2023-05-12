import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const navigate = useNavigate()

  const { user } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (user === null) {
      navigate('/home/signin')
    } else if (user.isAdmin !== true) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div>Admin</div>
  )
}

export default Admin
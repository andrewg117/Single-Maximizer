import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset as userReset, getTokenResult } from '../features/auth/authSlice'
import { reset as trackReset } from '../features/tracks/trackSlice'
import { toast } from 'react-toastify'

const TokenCheck = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    dispatch(getTokenResult())
    if (!user) {
      dispatch(logout())
      // dispatch(trackReset())
      // dispatch(userReset())
      toast.error("Login Expired")
      navigate('/home/signin')
    }
    toast.clearWaitingQueue()
  }, [user, navigate, dispatch])

  return children ?? <Outlet />;
}

export default TokenCheck
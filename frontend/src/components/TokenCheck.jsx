import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset, getTokenResult } from '../features/auth/authSlice'
import { toast } from 'react-toastify'

const TokenCheck = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isExpired } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    dispatch(getTokenResult())
    if(isExpired) {
      toast.error("Login Expired")
      dispatch(reset())
      dispatch(logout())
      navigate('/home/signin')
    }
  }, [isExpired, navigate, dispatch])

  return children ?? <Outlet />;
}

export default TokenCheck
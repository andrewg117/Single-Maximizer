import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice';
import '../css/profile_nav.css'

function NavBarLeft() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <>
      <nav id="navbar-left">
        <div id="navbar-left-links">
          <Link to='/profile'>PROFILE</Link>
          <Link to='/'>NEW RELEASE</Link>
          <Link to='/'>SINGLES</Link>
          <Link to='/'>ADMIN</Link>
          <Link to='/signin'>SETTINGS</Link>
          <Link onClick={onLogout}>LOGOUT</Link>
        </div>
      </nav>
    </>
  )
}

export default NavBarLeft
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice';
import styles from '../css/profile_nav.module.css'

function NavBarLeft() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <>
      <section id={styles.navbar_container}>
        <div id={styles.navbar_header}>
          <h1>{'Welcome, ' + user.name}</h1>
        </div>
        <div className={styles.navbar_left}>
          <div className={styles.navbar_left_links}>
            <Link to='/profile'>PROFILE</Link>
            <Link to='/newrelease'>NEW RELEASE</Link>
            <Link to='/singles'>SINGLES</Link>
          </div>
        </div>
        <div id={styles.navbar_footer}>
          <div className={styles.navbar_left_links}>
            <Link to='/'>ADMIN</Link>
            <Link to='/'>SETTINGS</Link>
            <Link onClick={onLogout}>LOGOUT</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default NavBarLeft
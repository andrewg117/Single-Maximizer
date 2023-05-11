import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice';
import styles from '../css/profile_nav.module.css'

function NavBarLeft() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [activeLink, setActiveLink] = useState('PROFILE');

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  const menuItems = [
    { name: 'PROFILE', path: "/profile", position: 'top' },
    { name: 'NEW RELEASE', path: "/profile/newrelease", position: 'top' },
    { name: 'SINGLES', path: "/profile/singles", position: 'top' },
    // { name: 'EMAIL', path: "/email", position: 'top' },
    { name: 'ADMIN', path: "/", position: 'bot' },
    { name: 'SETTINGS', path: "/", position: 'bot' },
    { name: 'LOGOUT', path: "/", position: 'bot' },
  ];

  return (
    <>
      <section id={styles.navbar_container}>
        <div id={styles.navbar_header}>
          <h1>{'Welcome, ' + user.name}</h1>
        </div>
        <div className={styles.navbar_left}>
          <div className={styles.navbar_left_links}>
            {menuItems
              .filter(menu => menu.position === 'top')
              .map(menu => (
                <Link
                  key={menu.name}
                  to={menu.path}
                  className={activeLink === menu.name ? styles.active : styles.inactive}
                  onClick={() => setActiveLink(menu.name)}
                >
                  {menu.name}
                </Link>
              ))}
          </div>
        </div>
        <div id={styles.navbar_footer}>
          <div className={styles.navbar_left_links}>
            {menuItems
              .filter(menu => menu.position === 'bot')
              .map(menu => (
                <Link
                  key={menu.name}
                  to={menu.path}
                  className={activeLink === menu.name ? styles.active : styles.inactive}
                  onClick={() => menu.name === 'LOGOUT' ? onLogout() : setActiveLink(menu.name)}
                >
                  {menu.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default NavBarLeft
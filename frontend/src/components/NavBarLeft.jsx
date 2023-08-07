import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, logout } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import { FaBars } from 'react-icons/fa'
import styles from '../css/profile_nav.module.css'

const NavBarTop = ({ menuItems, activeLink, setActiveLink, onLogout, toggleTopNav }) => {
  return (
    <div className={styles.navbar_left_links} id={styles.navbar_top_links}>
      {menuItems
        .filter(menu => menu.name !== 'SETTINGS')
        .map(menu => (
          <Link
            key={menu.name}
            to={menu.path}
            className={activeLink === menu.name ? styles.active : styles.inactive}
            onClick={() => {
              menu.name === 'LOGOUT' ? onLogout() :
              toggleTopNav()
              setActiveLink(menu.name)
            }}
          >
            {menu.name}
          </Link>
        ))}
    </div>
  )
}

function NavBarLeft() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [activeLink, setActiveLink] = useState('PROFILE')

  const [showTopNav, setTopNav] = useState(false)

  const toggleTopNav = (e) => {
    showTopNav === false ? setTopNav(true) : setTopNav(false)
  }

  const onLogout = (e) => {
    toast.clearWaitingQueue()
    dispatch(logout())
    navigate('/home')
  }

  const menuItems = [
    { name: 'PROFILE', path: "/profile", position: 'top' },
    {
      name: 'NEW RELEASE',
      path: user.trackAllowance >= 1 ? "/profile/newrelease" : "/profile/checkoutpage",
      position: 'top'
    },
    // { name: 'CHECKOUT', path: "/profile/checkoutpage", position: 'top' },
    { name: 'SINGLES', path: "/profile/singles", position: 'top' },
    // { name: 'EMAIL', path: "/email", position: 'top' },
    // { name: 'ADMIN', path: "/admin", position: 'bot' },
    // { name: 'SETTINGS', path: "/", position: 'bot' },
    { name: 'LOGOUT', path: "/", position: 'bot' },
  ]
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  return (
    <>
      <div id={styles.top_nav_container} onClick={toggleTopNav}>
        <FaBars id={styles.fabars} />
        <h1>Single Maximizer</h1>
      </div>
      {showTopNav ?
        <NavBarTop
          menuItems={menuItems}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          onLogout={onLogout}
          toggleTopNav={toggleTopNav}
        /> : null}
      <section id={styles.navbar_container}>
        <div id={styles.navbar_header}>
          <h1>{'Welcome, ' + user.username}</h1>
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
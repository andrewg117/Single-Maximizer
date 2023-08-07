import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import styles from '../css/navbar.module.css'

const NavBarTop = ({ menuItems, activeLink, setActiveLink, toggleTopNav }) => {
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

function NavBar() {
  const [activeLink, setActiveLink] = useState('HOME')
  const [showTopNav, setTopNav] = useState(false)

  const toggleTopNav = (e) => {
    showTopNav === false ? setTopNav(true) : setTopNav(false)
  }

  const menuItems = [
    { name: 'HOME', path: "/home" },
    { name: 'WHO WE ARE', path: "/home" },
    { name: 'FAQ', path: "/home" },
    { name: 'PRICING', path: "/home" },
    { name: 'SIGN IN', path: "/home/signin" },
    { name: 'SIGN UP', path: "/home/emailsignup" },
  ]

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
          toggleTopNav={toggleTopNav}
        /> : null}
      <nav id={styles.navbar}>
        <div id={styles.nav_links}>
          {menuItems.map(menu => (
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
      </nav>
    </>
  )
}

export default NavBar
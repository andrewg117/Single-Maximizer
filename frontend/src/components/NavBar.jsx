import { useState } from 'react';
import { Link } from 'react-router-dom'
import styles from '../css/navbar.module.css';

function NavBar() {
  const [activeLink, setActiveLink] = useState('HOME');

  const menuItems = [
    { name: 'HOME', path: "/home" },
    { name: 'WHO WE ARE', path: "/home" },
    { name: 'FAQ', path: "/home" },
    { name: 'PRICING', path: "/home" },
    { name: 'SIGN IN', path: "/home/signin" },
    { name: 'SIGN UP', path: "/home/signup" },
  ];

  return (
    <>
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
import { Link } from 'react-router-dom'
import styles from '../css/navbar.module.css';

function NavBar() {
  return (
    <>
      <nav id={styles.navbar}>
        <div id={styles.nav_links}>
          <Link to='/home'>HOME</Link>
          <Link to='/home'>WHO WE ARE</Link>
          <Link to='/home'>FAQ</Link>
          <Link to='/home'>PRICING</Link>
          <Link to='/home/signin'>SIGN IN</Link>
          <Link to='/home/signup'>SIGN UP</Link>
        </div>
      </nav>
    </>
  )
}

export default NavBar
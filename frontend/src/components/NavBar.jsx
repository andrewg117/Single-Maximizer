import { Link } from 'react-router-dom'
import '../css/navbar.css';

function NavBar() {
  return (
    <>
      <nav id="navbar">
        <div id="nav-links">
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
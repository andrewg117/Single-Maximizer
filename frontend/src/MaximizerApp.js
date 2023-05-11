import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import NavBar from './components/NavBar'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Singles from './pages/Singles'
import NewRelease from './pages/NewRelease'
import NavBarLeft from './components/NavBarLeft'
import styles from './css/style.module.css';

function MaximizerApp() {
  const { user } = useSelector(
    (state) => state.auth
  )
  return (
    <>
      <Router>
        <div className={styles.body}>
          <section id={!user ? styles.body_wrapper: styles.profile_body_wrapper}>
            {!user ? <NavBar /> : <NavBarLeft />}
            <Routes>
              {user === null ? <Route path='*' element={<Home />} />: <Route path='*' element={<Profile />} />}
              <Route path='/home' element={<Home />} />
              <Route path='/home/signup' element={<SignUp />} />
              <Route path='/home/signin' element={<SignIn />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/profile/editprofile' element={<ProfileEdit />} />
              <Route path='/profile/newrelease' element={<NewRelease />} />
              <Route path='/profile/singles' element={<Singles />} />
            </Routes>
          </section>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default MaximizerApp
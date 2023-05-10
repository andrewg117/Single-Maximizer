import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import NavBar from './components/NavBar'
import Profile from './pages/Profile'
import Singles from './pages/Singles'
// import Email from './pages/Email'
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
              {!user ? <Route path='*' element={<Home />} />: <Route path='*' element={<Profile />} />}
              <Route path='/home' element={<Home />} />
              <Route path='/home/signup' element={<SignUp />} />
              <Route path='/home/signin' element={<SignIn />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/newrelease' element={<NewRelease />} />
              <Route path='/singles' element={<Singles />} />
              {/* <Route path='/email' element={<Email />} /> */}
            </Routes>
          </section>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default MaximizerApp
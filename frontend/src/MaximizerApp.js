import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import EmailSignUp from './pages/EmailSignUp'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NavBar from './components/NavBar'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Singles from './pages/Singles'
import SingleEdit from './pages/SingleEdit'
import Admin from './pages/Admin'
import NewRelease from './pages/NewRelease'
import CheckoutPage from './pages/CheckoutPage'
import NavBarLeft from './components/NavBarLeft'
import TokenCheck from './components/TokenCheck'
import styles from './css/style.module.css';

function MaximizerApp() {
  const { user } = useSelector(
    (state) => state.auth
  )
  return (
    <>
      <Router>
        <div className={styles.body}>
          <section id={user === null ? styles.body_wrapper : styles.profile_body_wrapper}>
            {user === null ? <NavBar /> : <NavBarLeft />}
            <Routes>
              {user === null ? <Route path='*' element={<Home />} /> : <Route path='*' element={<Profile />} />}
              <Route path='/home' element={<Home />} />
              <Route path='/home/signup/:token' element={<SignUp />} />
              <Route path='/home/emailsignup' element={<EmailSignUp />} />
              <Route path='/home/signin' element={<SignIn />} />
              <Route path='/home/forgotpass' element={<ForgotPassword />} />
              <Route path='/home/resetpass/:token' element={<ResetPassword />} />
              <Route element={<TokenCheck />}>
                <Route path='/profile' element={<Profile />} />
                <Route path='/profile/editprofile' element={<ProfileEdit />} />
                <Route path='/profile/newrelease' element={<NewRelease />} />
                <Route path='/profile/checkoutpage' element={<CheckoutPage />} />
                <Route path='/profile/singles' element={<Singles />} />
                <Route path='/profile/singleedit/:id' element={<SingleEdit />} />
                <Route path='/admin' element={<Admin />} />
              </Route>
            </Routes>
          </section>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default MaximizerApp
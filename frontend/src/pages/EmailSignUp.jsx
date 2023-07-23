import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { emailUser, reset as resetUser } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import styles from '../css/sign_in_style.module.css'

function EmailSignUp() {
  const [formData, setFormData] = useState({
    email: '',
  })

  const { email } = formData

  const [emailSent, setEmailSent] = useState(false)

  const dispatch = useDispatch()

  const {  isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message, { id: message })
      toast.clearWaitingQueue()
    }

    return () => {
      dispatch(resetUser())
    }
  }, [ isError, message, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (isError) {
      toast.error(message)
    } else if (email === '') {
      toast.error("Add Email")
    } else {


      dispatch(emailUser({email, type: 'register'})).unwrap()
        .then(() => {
          setEmailSent(true)
        })
        .catch((error) => console.error(error))
    }
  }

  const resendEmail = (e) => {
    e.preventDefault()

    dispatch(emailUser({email, type: 'register'})).unwrap()
      .then(() => {
        setEmailSent(true)
      })
      .catch((error) => console.error(error))
  }


  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section id={styles.sign_in_wrapper}>
        <section id={styles.sign_in_content}>
          <div id={styles.block_left}>
            <h1>Image</h1>
          </div>

          <div id={styles.block_right}>
            <h1>Sign Up</h1>
            {emailSent === false ?
              <form id={styles.signin_form} onSubmit={onSubmit}>
                <div className={styles.signin_form_div}>
                  <label htmlFor="email">EMAIL</label>
                  <input
                    type="email"
                    className={styles.signin_input}
                    id='email'
                    name='email'
                    value={email}
                    onChange={onChange} />
                  <div className={styles.submit_div}>
                    <input type="submit" id={styles.signin_submit} value="SUBMIT" />
                  </div>
                </div>
              </form>
              :

              <form id={styles.signin_form} onSubmit={resendEmail}>
                <div className={styles.signin_form_div}>
                  <h1>Check your email to register your account</h1>
                  <h3>{email}</h3>
                  <div className={styles.submit_div}>
                    <input type="submit" id={styles.signin_submit} value="Resend Email" />
                  </div>
                </div>
              </form>}

          </div>
        </section>
      </section>
    </>
  )
}

export default EmailSignUp
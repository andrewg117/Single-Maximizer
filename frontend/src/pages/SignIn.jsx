import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import '../css/sign_in_style.css'

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/profile')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password
    }

    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section id="sign-in-content">
        <div id="block-left">
          <h1>Image</h1>
        </div>

        <div id="block-right">
          <h1>Sign In</h1>
          <form id="signin-form" onSubmit={onSubmit}>
            <div id="signin-form-div">
              <label htmlFor="email">EMAIL</label>
              <input
                type="email"
                className="form-control"
                id='email'
                name='email'
                value={email}
                placeholder='Enter Email'
                onChange={onChange} />
              <label htmlFor="pword">PASSWORD</label>
              <input
                type="password"
                className="form-control"
                id='password'
                name='password'
                value={password}
                placeholder='Enter Password'
                onChange={onChange} />
              <Link className="signin-link">Forgot Username?</Link>
              <Link className="signin-link">Forgot Password?</Link>
              <div id="submit-div">
                <input type="submit" id="signin-submit" value="SUBMIT" />
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default SignIn
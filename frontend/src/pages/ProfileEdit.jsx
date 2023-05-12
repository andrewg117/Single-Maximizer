import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, updateUser, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import styles from '../css/profile_style.module.css'

function ProfileEdit() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, userData, isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  const [name, setUsername] = useState(userData.name)
  const [email, setEmail] = useState(userData.email)
  const [website, setWebsite] = useState(userData.website)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    } else {
      dispatch(getUser())
    }

    if (user === null) {
      navigate('/home/signin')
    }

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(updateUser({ name, email, website }))

    navigate('/profile')
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.content_right}>
        <div id={styles.profile_title}>
          <h1>FMGMP3</h1>
        </div>
        <form id={styles.profile_form} onSubmit={onSubmit}>
          <div id={styles.profile_form_div}>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="name">USERNAME</label>
                <input
                  type="text"
                  className={styles.profile_input}
                  id='name'
                  name='name'
                  placeholder="Enter your artist name"
                  defaultValue={name}
                  onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email">EMAIL</label>
                <input
                  className={styles.profile_input}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="website">WEBSITE</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="website"
                  name="website"
                  placeholder="Enter your website starting with http://"
                  defaultValue={website}
                  onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD</label>
                <input className={styles.profile_input} type="url" id="scloud" name="soundcloud" placeholder="Enter your soundcloud link" />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="twitter">TWITTER</label>
                <input className={styles.profile_input} type="url" id="twitter" name="twitter" placeholder="Enter your twitter handle" />
              </div>
              <div>
                <label htmlFor="igram">INSTAGRAM</label>
                <input className={styles.profile_input} type="url" id="igram" name="instagram" placeholder="Enter your instagram username" />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="fbook">FACEBOOK</label>
                <input className={styles.profile_input} type="url" id="fbook" name="facebook" placeholder="Enter your facebook handle" />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY</label>
                <input className={styles.profile_input} type="url" id="spotify" name="spotify" placeholder="Enter your spotify URI" />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="ytube">YOUTUBE</label>
                <input className={styles.profile_input} type="url" id="ytube" name="youtube" placeholder="Enter your youtube profile link" />
              </div>
              <div>
                <label htmlFor="tiktok">TIKTOK</label>
                <input className={styles.profile_input} type="url" id="tiktok" name="tiktok" placeholder="Enter your tiktok username" />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="bio-text">BIO</label>
                <textarea name="" id="bio-text" cols="30" rows="10" placeholder="Enter your artist bio here"></textarea>
              </div>
            </div>
            <div id={styles.profile_submit_div}>
              <input type="submit" className={styles.profile_btn} value="SAVE" />
              <Link to={'/profile'} className={styles.profile_btn}>CANCEL</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default ProfileEdit
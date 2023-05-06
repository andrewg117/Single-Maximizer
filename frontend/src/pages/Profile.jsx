import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from '../css/profile_style.module.css'

function Profile() {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/home')
    }
  }, [user, navigate])

  return (
    <>
      <div id={styles.content_right}>
        <div id={styles.profile_title}>
          <h1>FMGMP3</h1>
        </div>
        <form id={styles.profile_form} action="/content/profile_view.html">
          <div id={styles.profile_form_div}>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="name">USERNAME</label>
                <input
                  type="text"
                  className={styles.profile_input}
                  id='name'
                  name='name'
                  placeholder="Enter your artist name" />
              </div>
              <div>
                <label htmlFor="email">EMAIL</label>
                <input className={styles.profile_input} type="email" id="email" name="email" placeholder="Enter your email address" />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="website">WEBSITE</label>
                <input className={styles.profile_input} type="url" id="website" name="website" placeholder="Enter your website starting with http://" />
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
              <button className={styles.profile_btn}>CANCEL</button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Profile
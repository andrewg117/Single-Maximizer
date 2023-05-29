import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUser, reset} from '../features/auth/authSlice'
import { Buffer } from 'buffer'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import styles from '../css/profile_style.module.css'

export const ProfileDiv = ({ labelID, text, userData }) => {
  return (
    <div>
      <label htmlFor={labelID}>{text}</label>
      <p id={labelID} name={labelID}>{userData}</p>
    </div>
  )
}

const Profile = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const { user, isExpired, isLoading, isError, message } = useSelector((state) => state.auth)


  const [fname, setFname] = useState(user !== null ? user.fname : "N/A")
  const [lname, setLname] = useState(user !== null ? user.lname : "N/A")
  const [username, setUsername] = useState(user !== null ? user.username : "N/A")
  const [email, setEmail] = useState(user !== null ? user.email : "N/A")
  const [website, setWebsite] = useState(user !== null ? user.website : "N/A")

  const [profileImage, setProfileImage] = useState(null)

  const userCallback = useCallback(() => {
    if (store.getState().auth['user']) {
      // console.log(store.getState().auth['user'])

      const user = store.getState().auth['user']
      // console.log(user)
      const image = user.profileImage

      const buffer = Buffer.from(image.buffer, 'ascii')


      setProfileImage(buffer)
      setFname(user.fname)
      setLname(user.lname)
      setUsername(user.username)
      setEmail(user.email)
      setWebsite(user.website)
    }
  }, [store])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (!isExpired) {
      dispatch(getUser())
      userCallback()
    }

    return () => {
      dispatch(reset())
    }
  }, [isExpired, isError, message, userCallback, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.profile_content_right}>
        <div id={styles.profile_view_div}>

          <div id={styles.top_div}>
            <div id={styles.image_div}>
              <img src={`data:image/*;base64,${profileImage}`} alt='N/A' />
            </div>
            <div></div>
          </div>

          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='fname'
              text='FIRST NAME'
              userData={fname}
            />
            <ProfileDiv
              labelID='lname'
              text='LAST NAME'
              userData={lname}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='username'
              text='USERNAME'
              userData={username}
            />
            <ProfileDiv
              labelID='email'
              text='EMAIL'
              userData={email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='website'
              text='WEBSITE'
              userData={!isExpired ? website : "No data"}
            />
            <ProfileDiv
              labelID='scloud'
              text='SOUNDCLOUD'
            // userData={userData.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='twitter'
              text='TWITTER'
            // userData={userData.email}
            />
            <ProfileDiv
              labelID='igram'
              text='INSTAGRAM'
            // userData={userData.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='fbook'
              text='FACEBOOK'
            // userData={userData.email}
            />
            <ProfileDiv
              labelID='spotify'
              text='SPOTIFY'
            // userData={userData.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='ytube'
              text='YOUTUBE'
            // userData={userData.email}
            />
            <ProfileDiv
              labelID='tiktok'
              text='TIKTOK'
            // userData={userData.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='bio-text'
              text='BIO'
            // userData={userData.email}
            />
          </div>
          <div id={styles.profile_submit_div}>
            <Link to={'/profile/editprofile'} className={styles.profile_btn}>EDIT</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
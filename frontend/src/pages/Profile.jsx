import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { reset, getTokenResult } from '../features/auth/authSlice'
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
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isExpired, isLoading, isError, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (!isExpired) {
      dispatch(getTokenResult())
    }

    return () => {
      dispatch(reset())
    }
  }, [isExpired, isError, message, navigate, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.profile_content_right}>
        <div id={styles.profile_title}>
          <img src="" alt="Upload Profile Avatar" />
        </div>
        <div id={styles.profile_view_div}>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='fname'
              text='FIRST NAME'
              userData={!isExpired ? user.fname : "No data"}
            />
            <ProfileDiv
              labelID='lname'
              text='LAST NAME'
              userData={!isExpired ? user.lname : "No data"}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='username'
              text='USERNAME'
              userData={!isExpired ? user.username : "No data"}
            />
            <ProfileDiv
              labelID='email'
              text='EMAIL'
              userData={!isExpired ? user.email : "No data"}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='website'
              text='WEBSITE'
              userData={!isExpired ? user.website : "No data"}
            />
            <ProfileDiv
              labelID='scloud'
              text='SOUNDCLOUD'
            // userData={user.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='twitter'
              text='TWITTER'
            // userData={user.email}
            />
            <ProfileDiv
              labelID='igram'
              text='INSTAGRAM'
            // userData={user.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='fbook'
              text='FACEBOOK'
            // userData={user.email}
            />
            <ProfileDiv
              labelID='spotify'
              text='SPOTIFY'
            // userData={user.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='ytube'
              text='YOUTUBE'
            // userData={user.email}
            />
            <ProfileDiv
              labelID='tiktok'
              text='TIKTOK'
            // userData={user.email}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='bio-text'
              text='BIO'
            // userData={user.email}
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
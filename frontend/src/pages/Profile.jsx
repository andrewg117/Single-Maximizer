import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUser, reset as resetUser } from '../features/auth/authSlice'
import { getImage, reset as resetImage } from '../features/image/imageSlice'
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
  const [formState, setFormState] = useState({
    fname: '',
    lname: '',
    username: '',
    email: '',
    website: '',
    scloud: '',
    twitter: '',
    igram: '',
    fbook: '',
    spotify: '',
    ytube: '',
    tiktok: '',
    bio_text: '',
    profileImage: null,
  })

  const { fname, lname, username, email, website, scloud, twitter, igram, fbook, spotify, ytube, tiktok, bio_text, profileImage } = formState

  const dispatch = useDispatch()
  const store = useStore()

  const { isExpired, isLoading, isError, message } = useSelector((state) => state.auth)


  store.subscribe(() => {
    const userState = store.getState().auth['user']
    const imageState = store.getState().image['image']

    if (userState !== null && !isExpired) {
      let buffer = null
      if (imageState) {
        const image = imageState ? imageState.file : null

        buffer = Buffer.from(image.buffer, 'ascii')
      }

      setFormState((prevState) => ({
        ...prevState,
        fname: userState.fname,
        lname: userState.lname,
        username: userState.username,
        email: userState.email,
        website: userState.website,
        scloud: userState.scloud,
        twitter: userState.twitter,
        igram: userState.igram,
        fbook: userState.fbook,
        spotify: userState.spotify,
        ytube: userState.ytube,
        tiktok: userState.tiktok,
        bio_text: userState.bio_text,
        profileImage: buffer,
      }))

    } else {
      setFormState((prevState) => ({
        ...prevState,
      }))
    }

  })

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (!isExpired) {
      dispatch(getUser())
      dispatch(getImage({ section: 'avatar' }))
    }
    return () => {
      dispatch(resetUser())
      dispatch(resetImage())
    }
  }, [isExpired, isError, message, dispatch])

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
              userData={scloud}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='twitter'
              text='TWITTER'
              userData={twitter}
            />
            <ProfileDiv
              labelID='igram'
              text='INSTAGRAM'
              userData={igram}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='fbook'
              text='FACEBOOK'
              userData={fbook}
            />
            <ProfileDiv
              labelID='spotify'
              text='SPOTIFY'
              userData={spotify}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='ytube'
              text='YOUTUBE'
              userData={ytube}
            />
            <ProfileDiv
              labelID='tiktok'
              text='TIKTOK'
              userData={tiktok}
            />
          </div>
          <div className={styles.profile_data_div}>
            <ProfileDiv
              labelID='bio_text'
              text='BIO'
              userData={bio_text}
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
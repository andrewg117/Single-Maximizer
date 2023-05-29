import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, updateUser, reset } from '../features/auth/authSlice'
import ImageUpload from '../components/ImageUpload'
import { Buffer } from 'buffer'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import styles from '../css/profile_style.module.css'

function ProfileEdit() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  const { user, isExpired, isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  const [fname, setFname] = useState(user !== null ? user.fname : "N/A")
  const [lname, setLname] = useState(user !== null ? user.lname : "N/A")
  const [username, setUsername] = useState(user !== null ? user.username : "N/A")
  const [email, setEmail] = useState(user !== null ? user.email : "N/A")
  const [website, setWebsite] = useState(user !== null ? user.website : "N/A")

  const [profileImage, setProfileImage] = useState(null)
  const [isEdit, setEdit] = useState(true)

  const userCallback = useCallback(() => {

    if (store.getState().auth['user'].profileImage) {
      const image = store.getState().auth['user'].profileImage

      const buffer = Buffer.from(image.buffer, 'ascii')


      // setTrackTitle(store.getState().auth['user'].trackTitle)
      // setArtist(store.getState().auth['user'].artist)
      setProfileImage(buffer)
    }
  }, [store])

  useEffect(() => {
    if (!isExpired) {
      dispatch(getUser())

      userCallback()
    }

    return(() => {
      dispatch(reset)
    })
  }, [isExpired, userCallback, navigate, isError, message, dispatch])

  const onSubmit = (e) => {
    e.preventDefault()

    if (isError) {
      toast.error(message)
    } 
    
    if (profileImage !== null && username.trim() !== '' && email.trim() !== '' && !isExpired) {

      if(isEdit === true) {
        dispatch(updateUser({
          fname,
          lname,
          username,
          email,
          website
        }))
  
        toast.success("Update Successful")
        navigate('/profile')

  
      } else if (isEdit === false) {
        let formData = profileImage
        formData.append("fname", fname)
        formData.append("lname", lname)
        formData.append("username", username)
        formData.append("email", email)
        formData.append("website", website)

        setProfileImage(formData)
        console.log(profileImage)
  
        dispatch(updateUser(profileImage))
        
        toast.success("Update Successful")
        navigate('/profile')
      } 

    } else {
      toast.error('Empty field')
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.profile_content_right}>
        <form id={styles.profile_form} onSubmit={onSubmit}>
          <div id={styles.profile_form_div}>

            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label>PROFILE IMAGE</label>
                <ImageUpload
                  changeFile={setProfileImage}
                  file={profileImage}
                  fieldname={'profileImage'}
                  altText={'Upload Profile Image'}
                  isEdit={isEdit}
                  setEdit={setEdit}
                />
              </div>
              <div></div>
            </div>

            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="fname">FIRST NAME</label>
                <input
                  type="text"
                  className={styles.profile_input}
                  id='fname'
                  name='fname'
                  placeholder="Enter your first name"
                  defaultValue={fname}
                  onChange={(e) => setFname(e.target.value)} />
              </div>
              <div>
                <label htmlFor="fname">LAST NAME</label>
                <input
                  type="text"
                  className={styles.profile_input}
                  id='lname'
                  name='lname'
                  placeholder="Enter your last name"
                  defaultValue={lname}
                  onChange={(e) => setLname(e.target.value)} />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="username">USERNAME</label>
                <input
                  type="text"
                  className={styles.profile_input}
                  id='username'
                  name='username'
                  placeholder="Enter your username"
                  defaultValue={username}
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
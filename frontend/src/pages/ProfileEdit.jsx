import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, updateUser, reset } from '../features/auth/authSlice'
import ImageUpload from '../components/ImageUpload'
import { Buffer } from 'buffer'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import styles from '../css/profile_style.module.css'

function ProfileEdit() {
  const [formState, setFormState] = useState({
    fname: '',
    lname: '',
    username: '',
    email: '',
    website: '',
    profileImage: null,
  })

  const {  fname,  lname, username, email, website, profileImage } = formState

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  const { isExpired, isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  const [isEdit, setEdit] = useState(true)

  store.subscribe(() => {
    const userState = store.getState().auth['user']

    if(userState !== null) {
      const image = userState.profileImage
  
      const buffer = Buffer.from(image.buffer, 'ascii')
  
      setFormState((prevState) => ({
        ...prevState,
        fname: userState.fname,
        lname: userState.lname,
        username: userState.username,
        email: userState.email,
        website: userState.website,
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
    }

    return(() => {
      dispatch(reset)
    })
  }, [isExpired, navigate, isError, message, dispatch])

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

        setFormState((prevState) => ({
          ...prevState,
          profileImage: formData
        }))

        console.log(profileImage)
  
        dispatch(updateUser(profileImage))
        
        toast.success("Update Successful")
        navigate('/profile')
      } 

    } else {
      toast.error('Empty field')
    }
  }

  const onChange = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
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
                  changeFile={setFormState}
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
                  value={fname}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="fname">LAST NAME</label>
                <input
                  type="text"
                  className={styles.profile_input}
                  id='lname'
                  name='lname'
                  placeholder="Enter your last name"
                  value={lname}
                  onChange={onChange} />
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
                  value={username}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="email">EMAIL</label>
                <input
                  className={styles.profile_input}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={onChange} />
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
                  value={website}
                  onChange={onChange} />
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
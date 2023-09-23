import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, updateUser, reset as resetUser } from '../features/auth/authSlice'
import { postImage, getImage, updateImage, reset as resetImage } from '../features/image/imageSlice'
import ImageUpload from '../components/ImageUpload'
import ConfirmAlert from '../components/ConfirmAlert'
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

  const navigate = useNavigate()
  const dispatch = useDispatch()
  let store = useStore()

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  const { image } = useSelector(
    (state) => state.image
  )

  const [showPopup, setShowPopup] = useState(false)
  const [imageState, setImageState] = useState(null)
  const [userState, setUserState] = useState(null)

  store.subscribe(() => {
    setUserState(store.getState().auth['user'])
    setImageState(store.getState().image['image'])

    if (userState) {
      let buffer
      if (imageState) {
        const imageFile = imageState.file

        buffer = Buffer.from(imageFile.buffer, 'ascii')
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


    dispatch(getUser()).unwrap()
      .catch((error) => console.error(error))
    dispatch(getImage({ 'section': 'avatar' })).unwrap()
      .catch((error) => console.error(error))

    return (() => {
      dispatch(resetUser())
      dispatch(resetImage())
    })
  }, [navigate, isError, message, dispatch])


  const onSubmit = () => {
    if (isError) {
      toast.error(message)
    }

    if (profileImage !== null && user) {

      dispatch(updateUser({ fname, lname, username, email, website, scloud, twitter, igram, fbook, spotify, ytube, tiktok, bio_text })).unwrap()
        .then(() => {
          if (image === null) {
            let imageData = new FormData()
            imageData.append("Image", profileImage.get('Image'))
            imageData.append("section", 'avatar')
            dispatch(postImage(imageData))
              .catch((error) => console.error(error))
          } else if (profileImage instanceof FormData) {
            let imageData = new FormData()
            imageData.append("Image", profileImage.get('Image'))
            imageData.append("section", 'avatar')
            dispatch(updateImage(imageData))
              .catch((error) => console.error(error))
          } 
        })
        .catch((error) => console.error(error))

      toast.success("Update Successful")
      navigate('/profile')
      setShowPopup(false)

    } else {
      setShowPopup(false)
      toast.error('Upload Avatar')
    }
  }

  const closeConfirm = () => {
    setShowPopup(false)
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
      <div id={styles.edit_profile_content_right}>
        <form id={styles.profile_form} onSubmit={(e) => {
          setShowPopup(() => {
            e.preventDefault()
            return true
          })
        }}>
          {showPopup &&
            (<ConfirmAlert
              message="Do you want to save these changes?"
              onConfirm={onSubmit}
              onCancel={closeConfirm}
            />)
          }
          <div id={styles.profile_form_div}>

            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label>PROFILE AVATAR</label>
                <ImageUpload
                  changeFile={setFormState}
                  file={profileImage}
                  fieldname={'profileImage'}
                  altText={'Upload Profile Image'}
                />
                <p>{profileImage instanceof FormData ? `Size Limit: ${profileImage.get('size')} / 10 MB` : null}</p>
              </div>
              <div></div>
            </div>

            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="fname">FIRST NAME</label>
                <input
                  required
                  type="text"
                  className={styles.profile_input}
                  id='fname'
                  name='fname'
                  placeholder="Enter your first name"
                  defaultValue={fname}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="lname">LAST NAME</label>
                <input
                  required
                  type="text"
                  className={styles.profile_input}
                  id='lname'
                  name='lname'
                  placeholder="Enter your last name"
                  defaultValue={lname}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="username">USERNAME</label>
                <input
                  required
                  type="text"
                  className={styles.profile_input}
                  id='username'
                  name='username'
                  placeholder="Enter your username"
                  defaultValue={username}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="email">EMAIL</label>
                <p
                  className={styles.profile_input}
                  type="email"
                  id="email"
                  name="email"
                  style={{ 'border': 'none' }}
                >
                  {email}
                </p>
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
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="scloud"
                  name="scloud"
                  placeholder="Enter your soundcloud link"
                  defaultValue={scloud}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="twitter">TWITTER</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="twitter"
                  name="twitter"
                  placeholder="Enter your twitter handle"
                  defaultValue={twitter}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="igram">INSTAGRAM</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="igram"
                  name="igram"
                  placeholder="Enter your instagram username"
                  defaultValue={igram}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="fbook">FACEBOOK</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="fbook"
                  name="fbook"
                  placeholder="Enter your facebook handle"
                  defaultValue={fbook}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="spotify"
                  name="spotify"
                  placeholder="Enter your spotify URI"
                  defaultValue={spotify}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="ytube">YOUTUBE</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="ytube"
                  name="ytube"
                  placeholder="Enter your youtube profile link"
                  defaultValue={ytube}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="tiktok">TIKTOK</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="tiktok"
                  name="tiktok"
                  placeholder="Enter your tiktok username"
                  defaultValue={tiktok}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.profile_input_div} id={styles.profile_textarea_div}>
              <div>
                <label htmlFor="bio_text">BIO</label>
                <textarea
                  required
                  name="bio_text"
                  id="bio_text"
                  cols="30" rows="10"
                  placeholder="Enter your artist bio here"
                  defaultValue={bio_text ? bio_text : ""}
                  onChange={onChange}></textarea>
              </div>
            </div>
            <div id={styles.profile_submit_div}>
              <button type='submit' className={styles.profile_btn}>SAVE</button>
              <Link to={'/profile'} className={styles.profile_btn}>CANCEL</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default ProfileEdit
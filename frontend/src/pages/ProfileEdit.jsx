import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
  const { user, isLoading, isError, message } = useSelector((state) => state.auth)

  const profileData = useRef({})

  const { image, isLoading: imageLoading } = useSelector((state) => state.image)

  const [formState, setFormState] = useState({
    profileImage: image ? Buffer.from(image.file.buffer, 'ascii') : null,
  })

  const { profileImage } = formState

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (isError) {
      toast.error(message, { id: message })
    }

    return (() => {
      toast.dismiss(message)
    })

  }, [isError, message])


  useEffect(() => {

    dispatch(getUser()).unwrap()
      .catch((error) => console.error(error))

    dispatch(getImage({ section: 'avatar' })).unwrap()
      .catch((error) => console.error(error))


    return (() => {
      dispatch(resetUser())
      dispatch(resetImage())
    })

  }, [dispatch])


  const onSubmit = () => {
    if (isError) {
      toast.error(message)
    }

    if (profileImage !== null && user) {

      dispatch(updateUser({
        fname: profileData.current.fname.value,
        lname: profileData.current.lname.value,
        username: profileData.current.username.value,
        website: profileData.current.website.value,
        scloud: profileData.current.scloud.value,
        twitter: profileData.current.twitter.value,
        igram: profileData.current.igram.value,
        fbook: profileData.current.fbook.value,
        spotify: profileData.current.spotify.value,
        ytube: profileData.current.ytube.value,
        tiktok: profileData.current.tiktok.value,
        bio_text: profileData.current.bio_text.value
      })).unwrap()
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


  if (isLoading || imageLoading) {
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
                  ref={ref => profileData.current.fname = ref}
                  defaultValue={user?.fname} />
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
                  ref={ref => profileData.current.lname = ref}
                  defaultValue={user?.lname} />
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
                  ref={ref => profileData.current.username = ref}
                  defaultValue={user?.username} />
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
                  {user?.email}
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
                  ref={ref => profileData.current.website = ref}
                  defaultValue={user?.website} />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="scloud"
                  name="scloud"
                  placeholder="Enter your soundcloud link"
                  ref={ref => profileData.current.scloud = ref}
                  defaultValue={user?.scloud} />
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
                  ref={ref => profileData.current.twitter = ref}
                  defaultValue={user?.twitter} />
              </div>
              <div>
                <label htmlFor="igram">INSTAGRAM</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="igram"
                  name="igram"
                  placeholder="Enter your instagram username"
                  ref={ref => profileData.current.igram = ref}
                  defaultValue={user?.igram} />
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
                  ref={ref => profileData.current.fbook = ref}
                  defaultValue={user?.fbook} />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="spotify"
                  name="spotify"
                  placeholder="Enter your spotify URI"
                  ref={ref => profileData.current.spotify = ref}
                  defaultValue={user?.spotify} />
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
                  ref={ref => profileData.current.ytube = ref}
                  defaultValue={user?.ytube} />
              </div>
              <div>
                <label htmlFor="tiktok">TIKTOK</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="tiktok"
                  name="tiktok"
                  placeholder="Enter your tiktok username"
                  ref={ref => profileData.current.tiktok = ref}
                  defaultValue={user?.tiktok} />
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
                  ref={ref => profileData.current.bio_text = ref}
                  defaultValue={user?.bio_text}></textarea>
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
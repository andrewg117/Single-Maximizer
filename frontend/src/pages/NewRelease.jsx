import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
// import Notification from '../components/Notification'
import { getUser, updateUser, reset as resetUser } from '../features/auth/authSlice'
import { sendNewTrackEmail, reset as resetEmail } from '../features/email/emailSlice'
import { createTrack, reset as resetTracks } from '../features/tracks/trackSlice'
import { postImage, postPress, reset as resetImage } from '../features/image/imageSlice'
import { postAudio, reset as resetAudio } from '../features/audio/audioSlice'
import ImageUpload from '../components/ImageUpload'
import AudioUpload from '../components/AudioUpload'
import PressUpload from '../components/PressUpload'
import ConfirmAlert from '../components/ConfirmAlert'
import GenreCheckBox from '../components/GenreCheckBox'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import styles from '../css/new_release_style.module.css'

function NewRelease() {
  const convertDate = (date) => {
    const d = new Date(date)

    const year = d.toLocaleString('default', { year: 'numeric', timeZone: 'UTC' })
    const month = d.toLocaleString('default', { month: '2-digit', timeZone: 'UTC' })
    const day = d.toLocaleString('default', { day: '2-digit', timeZone: 'UTC' })

    let returnDate = year + '-' + month + '-' + day

    return returnDate
  }
  const today = new Date()
  const graceDate = convertDate(today.setDate(today.getDate() + 1))

  const [formState, setFormState] = useState({
    trackTitle: '',
    artist: '',
    deliveryDate: graceDate,
    spotify: '',
    features: '',
    apple: '',
    producer: '',
    scloud: '',
    album: '',
    trackLabel: '',
    ytube: '',
    albumDate: '',
    genres: [],
    trackSum: '',
    pressSum: '',
    trackCover: null,
    trackAudio: null,
    trackPress: [],
    s3ImageURL: '',
    s3AudioURL: '',
  })

  const { trackTitle, artist, deliveryDate, spotify, features, apple, producer, scloud, album, trackLabel, ytube, albumDate, genres, trackSum, pressSum, trackCover, trackAudio, trackPress, s3ImageURL, s3AudioURL } = formState

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { isLoading, isError, message } = useSelector((state) => state.tracks)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(getUser()).unwrap()
      .then((data) => {
        if(data.trackAllowance === 0) {
          navigate('/profile/checkoutpage')
        }
      })
      .catch(err => console.error(err))


    return () => {
      dispatch(resetTracks())
      dispatch(resetImage())
      dispatch(resetEmail())
      dispatch(resetAudio())
    }
  }, [isError, message, dispatch, navigate])


  const trackEmail = useCallback((title, date, trackID) => {
    const recipient = process.env.REACT_APP_RECEMAIL
    const subject = `Track ${title} is scheduled.`
    const emailMessage = `Track ${title} will be sent by ${new Date(date).toLocaleString('en-us')}.`

    dispatch(sendNewTrackEmail({ recipient, subject, emailMessage, trackID }))

  }, [dispatch])

  const onSubmit = async () => {
    if (isError) {
      toast.error(message)
    }

    if (trackCover !== null && trackAudio !== null && trackPress.length && user) {

      let audioData = new FormData()
      audioData.append("trackAudio", trackAudio.get('trackAudio'))

      let imageData = new FormData()
      imageData.append("Image", trackCover.get('Image'))
      imageData.append("section", 'cover')

      let pressData = new FormData()
      trackPress.forEach((item) => {
        pressData.append("Press", item)
      })
      pressData.append("section", 'press')

      dispatch(createTrack({ trackTitle, artist, deliveryDate, spotify, features, apple, producer, scloud, album, trackLabel, ytube, albumDate, genres, trackSum, pressSum })).unwrap()
        .then((data) => {
          const trackID = data._id

          audioData.append("trackID", trackID)
          dispatch(postAudio(audioData))

          imageData.append("trackID", trackID)
          dispatch(postImage(imageData))

          pressData.append("trackID", trackID)
          dispatch(postPress(pressData))

          // trackEmail(data.trackTitle, data.deliveryDate, trackID)
          dispatch(updateUser({ trackAllowance: user.trackAllowance - 1 }))
        })

      setFormState((prevState) => ({
        ...prevState,
        trackAudio: null
      }))
      toast.success('Email Sent')
      navigate('/profile/singles')
      setShowPopup(false)

    } else {
      toast.error("Update Fields")
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
      <div id={styles.content_right}>
        <form id={styles.new_form} onSubmit={(e) => {
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

          <div id={styles.new_form_div}>
            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label>COVER ART</label>
                <ImageUpload
                  changeFile={setFormState}
                  file={trackCover}
                  fieldname={'trackCover'}
                  url={s3ImageURL}
                  urlField={'s3ImageURL'}
                  altText={'Upload Track Cover'}
                />
                <p>Size Limit: {trackCover ? trackCover.get('size') : 0} / 10 MB</p>
              </div>
              <div className={styles.top_input_div}>
                <div>
                  <label htmlFor="artist">ARTIST NAME</label>
                  <input
                    required
                    className={styles.new_input}
                    type="text"
                    id="artist"
                    name="artist"
                    placeholder="Enter your artist name"
                    defaultValue={artist}
                    onChange={onChange} />
                </div>
                <div>
                  <label htmlFor="trackTitle">TRACK NAME</label>
                  <input
                    required
                    className={styles.new_input}
                    type="text"
                    id="trackTitle"
                    name="trackTitle"
                    placeholder="Enter the name of your track"
                    value={trackTitle}
                    onChange={onChange} />
                </div>
              </div>
            </div>
            <div className={styles.file_input_div}>
              <div>
                <label>AUDIO UPLOAD</label>
                <AudioUpload
                  changeFile={setFormState}
                  file={trackAudio}
                  fieldname={'trackAudio'}
                  url={s3AudioURL}
                  urlField={'s3AudioURL'}
                />
                <p>Size Limit: {trackAudio ? trackAudio.get('size') : 0} / 21 MB</p>
              </div>
            </div>
            <div className={styles.file_input_div}>
              <div>
                <label>PRESS PHOTOS</label>
                <PressUpload
                  changeFile={setFormState}
                  trackPress={trackPress}
                />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="deliveryDate">DELIVERY DATE</label>
                <input
                  required
                  className={styles.new_input}
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  min={graceDate}
                  defaultValue={graceDate}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY TRACK URI</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="spotify"
                  name="spotify"
                  placeholder="Enter the URI of your track on Spotify"
                  value={spotify}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="features">FEATURES</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="features"
                  name="features"
                  placeholder="Enter the names of features"
                  value={features}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="applelink">APPLE MUSIC TRACK LINK</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="apple"
                  name="apple"
                  placeholder="Enter your Apple Music track link"
                  value={apple}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="producer">PRODUCER</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="producer"
                  name="producer"
                  placeholder="Who produced the track?"
                  value={producer}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD LINK</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="scloud"
                  name="scloud"
                  placeholder="Enter the track's Soundcloud link"
                  value={scloud}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="album">ALBUM</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="album"
                  name="album"
                  placeholder="Is this song part of an album?"
                  value={album}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="ytube">YOUTUBE LINK</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="ytube"
                  name="ytube"
                  placeholder="Enter the Youtube video link"
                  value={ytube}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="albumDate">ALBUM RELEASE DATE</label>
                <input
                  required
                  className={styles.new_input}
                  type="date"
                  id="albumDate"
                  name="albumDate"
                  value={albumDate}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="trackLabel">LABEL</label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="trackLabel"
                  name="trackLabel"
                  placeholder="What is the Label for the track?"
                  value={trackLabel}
                  onChange={onChange} />
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label htmlFor="genres">GENRES</label>
                <section id={styles.checkboxlist}>
                  <GenreCheckBox changeList={setFormState} list={genres ? genres : []} />
                </section>
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label htmlFor="trackSum">TRACK SUMMARY</label>
                <textarea
                  required
                  name="trackSum"
                  id="trackSum"
                  cols="30" rows="10"
                  placeholder="Enter your track details here"
                  value={trackSum}
                  onChange={onChange}></textarea>
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label htmlFor="pressSum">RECENT PRESS</label>
                <textarea
                  required
                  name="pressSum"
                  id="pressSum"
                  cols="30" rows="10"
                  placeholder="Enter recent accomplishments"
                  value={pressSum}
                  onChange={onChange}></textarea>
              </div>
            </div>
            <div id={styles.submit_div}>
              <button type="submit" className={styles.profile_btn}>SAVE</button>
              <Link to={'/profile'} className={styles.profile_btn}>CANCEL</Link>
            </div>

          </div>
        </form >

      </div>
    </>
  )
}

export default NewRelease
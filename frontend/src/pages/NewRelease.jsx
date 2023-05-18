import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// import Notification from '../components/Notification'
import { sendEmail } from '../features/email/emailSlice';
import { createTrack } from '../features/tracks/trackSlice'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import styles from '../css/new_release_style.module.css'

function NewRelease() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { isLoading, isError, message } = useSelector((state) => state.tracks)

  const stateUser = user !== null ? user : {}
  const [trackTitle, setTrackTitle] = useState('')
  const [artist, setArtist] = useState(stateUser.username)

  const minDate = () => {
    const date = new Date()
    const graceDate = new Date(date.setDate(date.getDate() + 7))

    const year = graceDate.toLocaleString('default', { year: 'numeric' })
    const month = graceDate.toLocaleString('default', { month: '2-digit' })
    const day = graceDate.toLocaleString('default', { day: '2-digit' })

    return year + '-' + month + '-' + day + 'T00:00'
  }

  const [deliveryDate, setDeliveryDate] = useState(minDate())

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
  }, [navigate, isError, message])

  const recipient = process.env.REACT_APP_RECEMAIL
  const subject = `Track ${trackTitle} is scheduled.`
  const emailMessage = `Track ${trackTitle} will be sent by ${new Date(deliveryDate).toLocaleString('en-us')}.`

  const onSubmit = (e) => {
    e.preventDefault()

    if (trackTitle) {
      console.log(recipient)
      dispatch(sendEmail({ recipient, subject, emailMessage }))
    }

    dispatch(createTrack({ trackTitle, artist, deliveryDate }))
    setTrackTitle('')
    setArtist('')
    setDeliveryDate('')
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.content_right}>
        <form id={styles.new_form} onSubmit={onSubmit}>
          <div id={styles.new_form_div}>
            <div id={styles.top_div}>
              <h1>FMGMP3</h1>
              <div className={styles.top_input_div}>
                <div>
                  <label htmlFor="artist">ARTIST NAME</label>
                  <input className={styles.new_input} type="text" id="artist" name="artist" placeholder="Enter your artist name" defaultValue={stateUser.username} onChange={(e) => setArtist(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="trackTitle">TRACK NAME</label>
                  <input className={styles.new_input} type="text" id="trackTitle" name="trackTitle" placeholder="Enter the name of your track" value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.input_div} />
            <div>
              <label htmlFor="deliveryDate">DELIVERY DATE</label>
              <input className={styles.new_input} type="datetime-local" id="deliveryDate" name="deliveryDate" min={minDate()} defaultValue={minDate()} onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="spoturi">SPOTIFY TRACK URI</label>
              <input className={styles.new_input} type="text" id="spoturi" name="spoturi" placeholder="Enter the URI of your track on Spotify" />
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="features">FEATURES</label>
                <input className={styles.new_input} type="text" id="features" name="features" placeholder="Enter the names of features" />
              </div>
              <div>
                <label htmlFor="applelink">APPLE MUSIC TRACK LINK</label>
                <input className={styles.new_input} type="text" id="applelink" name="applelink" placeholder="Enter your Apple Music track link" />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="producer">PRODUCER</label>
                <input className={styles.new_input} type="text" id="producer" name="producer" placeholder="Who produced the track?" />
              </div>
              <div>
                <label htmlFor="scloudlink">SOUNDCLOUD LINK</label>
                <input className={styles.new_input} type="text" id="scloudlink" name="scloudlink" placeholder="Enter the track's Soundcloud link" />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="album">ALBUM</label>
                <input className={styles.new_input} type="text" id="album" name="album" placeholder="Is this song part of an album?" />
              </div>
              <div>
                <label htmlFor="ytubelink">YOUTUBE LINK</label>
                <input className={styles.new_input} type="text" id="ytubelink" name="ytubelink" placeholder="Enter the Youtube video link" />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="albumdate">ALBUM RELEASE DATE</label>
                <input className={styles.new_input} type="text" id="albumdate" name="albumdate" placeholder="When will the album be released?" />
              </div>
              <div>
                <label htmlFor="genres">GENRES</label>
                <input className={styles.new_input} type="text" id="genres" name="genres" placeholder="Enter the genres that fit your song" />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="tracksum">TRACK SUMMARY</label>
                <textarea name="tracksum" id="tracksum" cols="30" rows="10" placeholder="Enter your track details here"></textarea>
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="press">RECENT PRESS</label>
                <textarea name="press" id="press" cols="30" rows="10" placeholder="Enter recent accomplishments"></textarea>
              </div>
            </div>
            <div id={styles.submit_div}>
              <input type="submit" className={styles.profile_btn} value="SAVE" />
              {/* <Notification
                type="submit"
                trackTitle={trackTitle}
                artist={artist}
                deliveryDate={deliveryDate}
                style={styles.profile_btn}
              /> */}
              <button className={styles.profile_btn} >CANCEL</button>
            </div>

          </div>
        </form >

      </div>
    </>
  )
}

export default NewRelease
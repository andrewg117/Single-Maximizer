import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
// import Notification from '../components/Notification'
// import { sendEmail } from '../features/email/emailSlice';
import { getSingle, updateSingle, deleteTrack } from '../features/tracks/trackSlice'
import ImageUpload from '../components/ImageUpload'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { Buffer } from 'buffer'
import styles from '../css/new_release_style.module.css'

function SingleEdit() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  const { isExpired } = useSelector((state) => state.auth)
  const { single, isLoading, isError, message } = useSelector((state) => state.tracks)

  // const singleState = isExpired !== true ? single : {}
  const singleState = useMemo(() => isExpired !== true ? single : {}, [single, isExpired])

  const [trackTitle, setTrackTitle] = useState(singleState.trackTitle)
  const [artist, setArtist] = useState(singleState.artist)
  const [trackCover, setCover] = useState(null)
  const [isEdit, setEdit] = useState(true)

  const getCover = useCallback(() => {

    if (store.getState().tracks['single'].trackCover) {
      const cover = store.getState().tracks['single'].trackCover

      const buffer = Buffer.from(cover.buffer, 'ascii')
      // const blob = new Blob(buffer, { type: cover.mimetype })

      // const formData = new FormData()
      // formData.append(cover.fieldname, blob, cover.originalname)

      // console.log(buffer)

      setCover(buffer)
    }
  }, [store])


  const { id } = useParams()

  const convertDate = (date, isDefault) => {

    const year = date.toLocaleString('default', { year: 'numeric' })
    const month = date.toLocaleString('default', { month: '2-digit' })
    const day = date.toLocaleString('default', { day: '2-digit' })
    const time = date.toLocaleTimeString("en-US", { hour12: false })

    if (isDefault) {
      return year + '-' + month + '-' + day + 'T' + time + '.000Z'
    } else {
      return year + '-' + month + '-' + day + 'T' + time.slice(0, -3)
    }
  }


  const today = new Date()
  const graceDate = convertDate(new Date(today.setDate(today.getDate() + 7)), false)
  const localDate = new Date(singleState.deliveryDate).toString()
  const stringDate = convertDate(new Date(localDate), false)
  const defaultDate = convertDate(new Date(localDate), true)

  const [deliveryDate, setDeliveryDate] = useState()

  const onSubmit = (e) => {
    e.preventDefault()

    if (isError) {
      toast.error(message)
    }
    if(trackTitle !== '' && artist !== '' && !isExpired) {
    
      if(isEdit === true) {
        dispatch(updateSingle({ id, trackTitle, artist, deliveryDate }))
  
        // toast.success("Update Successful")
        // navigate('/profile/singles')
  
      } else if (isEdit === false) {
        let formData = new FormData()
        formData.append("trackCover", trackCover)
        formData.append("id", id)
        formData.append("trackTitle", trackTitle)
        formData.append("artist", artist)
        formData.append("deliveryDate", deliveryDate)
        console.log(formData)
        // console.log(recipient)
        // dispatch(sendEmail({ recipient, subject, emailMessage }))
        // dispatch(updateSingle({ id, trackTitle, artist, deliveryDate, trackCover: trackCover }))
        dispatch(updateSingle(formData))
  
        // toast.success("Update Successful")
        // navigate('/profile/singles')
  
      } else {
        toast.error("Update Fields")
      }

    }
  }

  const deleteSingle = (e) => {
    e.preventDefault()
    dispatch(deleteTrack(id))
    toast.success("Single Deleted")
    navigate('/profile/singles')
  }

  const goBackToSingles = (e) => {
    e.preventDefault()
    navigate('/profile/singles')
  }


  useEffect(() => {
    setDeliveryDate(defaultDate)

    if (!isExpired) {
      dispatch(getSingle(id))

      getCover()
    }


  }, [defaultDate, getCover, isExpired, navigate, isError, message, id, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.content_right}>
        <form id={styles.new_form} onSubmit={onSubmit}>
          <div id={styles.new_form_div}>
            <div id={styles.top_div}>
              {/* {trackCover !== null ? <img src={`data:image/jpeg;base64,${trackCover}`} alt='Cover'  /> : <ImageUpload changeFile={setCover} file={trackCover} />} */}
              <ImageUpload changeFile={setCover} file={trackCover} isEdit={isEdit} setEdit={setEdit} />
              {/* <img src={`data:image/jpeg;base64,${trackCover}`} alt='test'  /> */}
              <div className={styles.top_input_div}>
                <div>
                  <label htmlFor="artist">ARTIST NAME</label>
                  <input
                    className={styles.new_input}
                    type="text"
                    id="artist"
                    name="artist"
                    placeholder="Enter your artist name"
                    defaultValue={singleState.artist}
                    onChange={(e) => setArtist(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="trackTitle">TRACK NAME</label>
                  <input
                    className={styles.new_input}
                    type="text"
                    id="trackTitle"
                    name="trackTitle"
                    placeholder="Enter the name of your track"
                    defaultValue={singleState.trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.input_div} />
            <div>
              <label htmlFor="deliveryDate">DELIVERY DATE</label>

              <input
                className={styles.new_input}
                type="datetime-local"
                id="deliveryDate"
                name="deliveryDate"
                min={graceDate}
                defaultValue={stringDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
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
              <button className={styles.profile_btn} onClick={deleteSingle}>DELETE</button>
              <button className={styles.profile_btn} onClick={goBackToSingles}>CANCEL</button>
            </div>

          </div>
        </form >

      </div>
    </>
  )
}

export default SingleEdit
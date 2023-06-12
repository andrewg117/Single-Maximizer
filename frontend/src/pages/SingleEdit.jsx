import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSingle, updateSingle, deleteTrack, reset as resetSingle } from '../features/tracks/trackSlice'
import { postImage, getImage, updateImage, deleteImage, reset as resetImage } from '../features/image/imageSlice'
import { getAudio, deleteAudio, reset as resetAudio, updateAudio } from '../features/audio/audioSlice'
import ImageUpload from '../components/ImageUpload'
import AudioUpload from '../components/AudioUpload'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { Buffer } from 'buffer'
import styles from '../css/new_release_style.module.css'

function SingleEdit() {
  const [formState, setFormState] = useState({
    trackTitle: '',
    artist: '',
    deliveryDate: '',
    trackCover: null,
    trackAudio: null,
  })

  const { trackTitle, artist, deliveryDate, trackCover, trackAudio } = formState

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  const { isExpired } = useSelector((state) => state.auth)
  const { isLoading, isError, message } = useSelector((state) => state.tracks)

  const { id } = useParams()


  const convertDate = (date, isDefault) => {
    const d = new Date(date)

    const year = d.toLocaleString('default', { year: 'numeric' })
    const month = d.toLocaleString('default', { month: '2-digit' })
    const day = d.toLocaleString('default', { day: '2-digit' })
    const time = d.toLocaleTimeString("en-US", { hour12: false })

    let returnDate

    if (isDefault) {
      returnDate = year + '-' + month + '-' + day + 'T' + time + '.000Z'
    } else {
      returnDate = year + '-' + month + '-' + day + 'T' + time.slice(0, -3)
    }

    return returnDate
  }

  const today = new Date()
  const graceDate = convertDate(new Date(today.setDate(today.getDate() + 7)), false)
  const stringDate = convertDate(store.getState().tracks['single'].deliveryDate, false)

  const [singleState, setSingleState] = useState({})
  const [audioState, setAudioState] = useState(null)
  const [trackState, setTrackState] = useState(null)

  store.subscribe(() => {
    setSingleState(store.getState().tracks['single'])
    setAudioState(store.getState().audio['audio'])
    setTrackState(store.getState().image['image'])

    if (Object.keys(singleState).length > 0 && audioState && trackState) {
      // console.log(singleState.trackCover)

      const image = trackState.file
      const trackBuffer = Buffer.from(image.buffer, 'ascii')
      const audio = audioState.file

      const defaultDate = convertDate(singleState.deliveryDate, true)

      setFormState((prevState) => ({
        ...prevState,
        trackTitle: singleState.trackTitle,
        artist: singleState.artist,
        deliveryDate: defaultDate,
        trackCover: trackBuffer,
        trackAudio: audio,
      }))

    } else {
      setFormState((prevState) => ({
        ...prevState,
      }))
    }

  })


  const onSubmit = (e) => {
    e.preventDefault()

    if (isError) {
      toast.error(message)
    }

    if (trackCover !== null && trackAudio !== null && trackTitle !== '' && artist !== '' && !isExpired) {

        dispatch(updateSingle({ id, trackTitle, artist, deliveryDate })).unwrap()
        .then((data) => {
          if (trackCover instanceof FormData) {
            let imageData = new FormData()
            imageData.append("Image", trackCover.get('Image'))
            imageData.append("trackID", id)
            imageData.append("section", 'cover')
            dispatch(updateImage(imageData))
          } else {
            let imageData = new FormData()
            imageData.append("Image", trackCover)
            imageData.append("trackID", id)
            imageData.append("section", 'cover')
            dispatch(updateImage(imageData))
          }

          if (trackAudio instanceof FormData){
            let audioData = new FormData()
            audioData.append("trackAudio", trackAudio.get('trackAudio'))
            audioData.append("trackID", id)
            dispatch(updateAudio(audioData))
          } else {
            let audioData = new FormData()
            audioData.append("trackAudio", trackAudio)
            audioData.append("trackID", id)
            dispatch(updateAudio(audioData))
          }

          toast.success("Update Successful")
          navigate('/profile/singles')
        })

    } else {
      toast.error("Update Fields")
    }
  }

  const deleteSingle = (e) => {
    e.preventDefault()
    dispatch(deleteTrack(id))
    dispatch(deleteImage(id))
    dispatch(deleteAudio(id))
    toast.success("Single Deleted")
    navigate('/profile/singles')
  }

  const goBackToSingles = (e) => {
    e.preventDefault()
    navigate('/profile/singles')
  }

  const onChange = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (!isExpired) {
      dispatch(getSingle(id))
      dispatch(getImage({ 
        'trackID': id,
        'section': 'cover' 
      }))
      dispatch(getAudio(id))
    }

    return (() => {
      dispatch(resetSingle)
      dispatch(resetImage)
      dispatch(resetAudio)
    })


  }, [isExpired, isError, message, id, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.content_right}>
        <form id={styles.new_form} onSubmit={onSubmit}>
          <div id={styles.new_form_div}>
            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label>COVER ART</label>
                <ImageUpload
                  changeFile={setFormState}
                  file={trackCover}
                  fieldname={'trackCover'}
                  altText={'Upload Track Cover'}
                />
              </div>
              <div className={styles.top_input_div}>
                <div>
                  <label htmlFor="artist">ARTIST NAME</label>
                  <input
                    className={styles.new_input}
                    type="text"
                    id="artist"
                    name="artist"
                    placeholder="Enter your artist name"
                    defaultValue={artist}
                    onChange={onChange}
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
                    defaultValue={trackTitle}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <AudioUpload
                changeFile={setFormState}
                file={trackAudio}
                fieldname={'trackAudio'}
              />
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
                onChange={onChange}
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
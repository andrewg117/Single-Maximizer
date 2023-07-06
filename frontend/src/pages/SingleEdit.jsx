import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSingle, updateSingle, deleteTrack, reset as resetSingle } from '../features/tracks/trackSlice'
import { postPress, getImage, getPress, updateImage, deleteImage, deletePress, reset as resetImage } from '../features/image/imageSlice'
import { getAudio, deleteAudio, reset as resetAudio, updateAudio } from '../features/audio/audioSlice'
import ImageUpload from '../components/ImageUpload'
import AudioUpload from '../components/AudioUpload'
import PressEdit from '../components/PressEdit'
import ConfirmAlert from '../components/ConfirmAlert'
import GenreCheckBox from '../components/GenreCheckBox'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { Buffer } from 'buffer'
import styles from '../css/new_release_style.module.css'

function SingleEdit() {
  // const { press } = useSelector((state) => state.image)

  const [formState, setFormState] = useState({
    trackTitle: '',
    artist: '',
    deliveryDate: '',
    spotify: '',
    features: '',
    apple: '',
    producer: '',
    scloud: '',
    album: '',
    ytube: '',
    albumDate: '',
    genres: [],
    trackSum: '',
    pressSum: '',
    trackCover: null,
    trackAudio: null,
    trackPress: [],
    newPressList: [],
    deletePressList: [],
  })

  const { trackTitle, artist, deliveryDate, spotify, features, apple, producer, scloud, album, ytube, albumDate, genres, trackSum, pressSum, trackCover, trackAudio, trackPress, newPressList, deletePressList } = formState

  const [genreList, changeGenreList] = useState(['CHH', 'Pop'])

  const { isPressSuccess } = useSelector((state) => state.image)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  const { isExpired } = useSelector((state) => state.auth)
  const { isLoading, isError, message } = useSelector((state) => state.tracks)
  const [showPopup, setShowPopup] = useState(false)
  const [showDelPopup, setShowDelPopup] = useState(false)

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
  const [pressState, setPressState] = useState(null)

  store.subscribe(() => {
    setSingleState(store.getState().tracks['single'])
    setAudioState(store.getState().audio['audio'])
    setTrackState(store.getState().image['image'])
    setPressState(store.getState().image['press'])

    if (Object.keys(singleState).length > 0 && audioState && trackState && pressState) {
      // console.log(pressState)

      const image = trackState.file
      const trackBuffer = Buffer.from(image.buffer, 'ascii')
      const audio = audioState.file

      const defaultDate = convertDate(singleState.deliveryDate, true)

      setFormState((prevState) => ({
        ...prevState,
        trackTitle: singleState.trackTitle,
        artist: singleState.artist,
        deliveryDate: defaultDate,
        spotify: singleState.spotify,
        features: singleState.features,
        apple: singleState.apple,
        producer: singleState.producer,
        scloud: singleState.scloud,
        album: singleState.album,
        ytube: singleState.ytube,
        albumDate: singleState.albumDate,
        genres: singleState.genres,
        trackSum: singleState.trackSum,
        pressSum: singleState.pressSum,
        trackCover: trackBuffer,
        trackAudio: audio,
        trackPress: pressState
      }))

    } else {
      setFormState((prevState) => ({
        ...prevState,
      }))
    }

  })


  const onSubmit = () => {
    if (isError) {
      toast.error(message)
    }

    if (trackCover !== null && trackAudio !== null && trackTitle !== '' && artist !== '' && !isExpired) {

      dispatch(updateSingle({
        trackID: id,
        trackTitle,
        artist,
        deliveryDate,
        spotify,
        features,
        apple,
        producer,
        scloud,
        album,
        ytube,
        albumDate,
        genres,
        trackSum,
        pressSum,
      })).unwrap()
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

          if (trackAudio instanceof FormData) {
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

          if (newPressList.length > 0) {
            let pressData = new FormData()
            newPressList.forEach((item) => {
              pressData.append("Press", item)
            })
            pressData.append("trackID", id)
            pressData.append("section", 'press')
            dispatch(postPress(pressData))
          }
          if (deletePressList.length > 0) {
            deletePressList.forEach((item) => {
              // console.log(item._id)
              dispatch(deletePress(item._id))
            })
          }

          toast.success("Update Successful")
          navigate('/profile/singles')
          setShowPopup(false)
        })

    } else {
      toast.error("Update Fields")
    }
  }

  const closeConfirm = () => {
    setShowPopup(false)
    setShowDelPopup(false)
  }

  const deleteSingle = () => {
    dispatch(deleteAudio(id)).unwrap()
      .then(() => {
        dispatch(deleteImage(id)).unwrap()
          .then(() => {
            dispatch(deleteTrack(id)).unwrap()
              .then(() => {
                toast.success("Single Deleted")
                navigate('/profile/singles')
                setShowDelPopup(false)
              })
          })
      })
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
      dispatch(getPress({
        'trackID': id,
      }))
      dispatch(getAudio(id))
    }

    return (() => {
      dispatch(resetSingle())
      dispatch(resetImage())
      dispatch(resetAudio())
    })


  }, [isExpired, isError, message, id, dispatch])

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
            <div className={styles.top_input_div}>
              <AudioUpload
                changeFile={setFormState}
                file={trackAudio}
                fieldname={'trackAudio'}
              />
            </div>
            <div className={styles.top_input_div}>
              <label>PRESS PHOTOS</label>
              {isPressSuccess ?
                <PressEdit
                  changeFile={setFormState}
                  trackPress={trackPress}
                  newPressList={newPressList}
                  deletePressList={deletePressList}
                />
                :
                <></>}
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
              <label htmlFor="spotify">SPOTIFY TRACK URI</label>
              <input
                className={styles.new_input}
                type="text"
                id="spotify"
                name="spotify"
                placeholder="Enter the URI of your track on Spotify"
                value={spotify}
                onChange={onChange} />
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="features">FEATURES</label>
                <input
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
                  className={styles.new_input}
                  type="text"
                  id="producer"
                  name="producer"
                  placeholder="Who produced the track?"
                  value={producer}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="scloudlink">SOUNDCLOUD LINK</label>
                <input
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
                  className={styles.new_input}
                  type="text"
                  id="album"
                  name="album"
                  placeholder="Is this song part of an album?"
                  value={album}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="ytubelink">YOUTUBE LINK</label>
                <input
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
                <label htmlFor="albumdate">ALBUM RELEASE DATE</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="albumDate"
                  name="albumDate"
                  placeholder="When will the album be released?"
                  value={albumDate}
                  onChange={onChange} />
              </div>
              <div>
                <label htmlFor="genres">GENRES</label>
                {/* <input
                  className={styles.new_input}
                  type="checkbox"
                  id="genres"
                  name="genres"
                  placeholder="Enter the genres that fit your song"
                  // value={genres}
                  value={['genres', 'genres']}
                  onChange={onChange} /> */}
                <GenreCheckBox changeList={setFormState} list={genres} />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="tracksum">TRACK SUMMARY</label>
                <textarea
                  name="trackSum"
                  id="trackSum"
                  cols="30" rows="10"
                  placeholder="Enter your track details here"
                  value={trackSum}
                  onChange={onChange}></textarea>
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="press">RECENT PRESS</label>
                <textarea
                  name="pressSum"
                  id="pressSum"
                  cols="30" rows="10"
                  placeholder="Enter recent accomplishments"
                  value={pressSum}
                  onChange={onChange}></textarea>
              </div>
            </div>
            <div id={styles.submit_div}>
              <input type="submit" className={styles.profile_btn} value="SAVE" />
              <button className={styles.profile_btn} onClick={(e) => {
                setShowDelPopup(() => {
                  e.preventDefault()
                  return true
                })
              }}>DELETE</button>
              {showDelPopup &&
                (<ConfirmAlert
                  message="Do you want to delete this Single?"
                  onConfirm={deleteSingle}
                  onCancel={closeConfirm}
                />)
              }
              <button className={styles.profile_btn} onClick={goBackToSingles}>CANCEL</button>
            </div>

          </div>
        </form >

      </div>
    </>
  )
}

export default SingleEdit
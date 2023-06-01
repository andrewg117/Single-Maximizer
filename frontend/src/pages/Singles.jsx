import { useEffect, useState } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getTracks, reset } from '../features/tracks/trackSlice'
import Spinner from '../components/Spinner'
import { FaEdit } from 'react-icons/fa'
import styles from '../css/singles_style.module.css'

function Singles() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  const { isExpired } = useSelector((state) => state.auth)
  const { tracks, isLoading } = useSelector((state) => state.tracks)

  const [trackState, setTrackState] = useState([])
  // let trackState = []

  store.subscribe(() => {
    if (tracks.length !== 0) {
      setTrackState(tracks)
      // trackState = store.getState().tracks['tracks']
      // console.log(trackState.length)
    }
  })

  useEffect(() => {
    if (!isExpired) {
      dispatch(getTracks())
    }

    return () => {
      dispatch(reset())
    }
  }, [dispatch, navigate, isExpired])

  const currentTime = new Date().getTime() / 1000
  const isDeliverd = (date) => {
    const d = new Date(date).getTime() / 1000
    return (
      d < currentTime ? true : false
    )
  }

  const editTrack = (e, id) => {
    e.preventDefault()

    // dispatch(deleteTrack(id))
    navigate(`/profile/singleedit/${id}`)
  }

  if (isLoading && trackState.length === 0) {
    return <Spinner />
  }

  return (
    <>
      <div id={styles.content_right}>
        {/* https://datatables.net/index */}
        <div id={styles.table_div}>
          <table id={styles.singles_table}>
            <thead id={styles.singles_header}>
              <tr>
                <th>ARTIST</th>
                <th>TITLE</th>
                <th>DELIVERY DATE</th>
                <th>STATUS</th>
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody id={styles.singles_content}>
              {trackState.length > 0 ? (
                trackState.map((track) => (
                  <tr key={track._id}>
                    <td>{track.artist}</td>
                    <td>{track.trackTitle}</td>
                    <td>{new Date(track.deliveryDate).toLocaleString('en-us')}</td>
                    <td>
                      <button className={isDeliverd(track.deliveryDate) ? styles.delivered : styles.scheduled}>{isDeliverd(track.deliveryDate) ? 'Delivered' : 'Scheduled'}</button>
                    </td>
                    <td>
                      {!isDeliverd(track.deliveryDate) ? <FaEdit onClick={(e) => editTrack(e, track._id)} className={styles.edit_track} /> : <></>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td>No Tracks</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default Singles
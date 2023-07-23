import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getTracks, reset } from '../features/tracks/trackSlice'
import Spinner from '../components/Spinner'
import { FaEdit } from 'react-icons/fa'
import styles from '../css/singles_style.module.css'

function Singles() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { tracks, isLoading } = useSelector((state) => state.tracks)

  const [trackState, setTrackState] = useState(tracks)

  useEffect(() => {
    dispatch(getTracks()).unwrap()
      .then((data) => {
        setTrackState(data)
      })
      .catch((error) => console.error(error))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, navigate])

  const editTrack = (e, id) => {
    e.preventDefault()

    // dispatch(deleteTrack(id))
    navigate(`/profile/singleedit/${id}`)
  }

  if (isLoading) {
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
                    <td>{new Date(track.deliveryDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                    <td>
                      {track.deliveryDate ? <button className={track.isDelivered ? styles.delivered : styles.scheduled}>{track.isDelivered ? 'Delivered' : 'Scheduled'}</button> : <button className={styles.pending}>{"Pending"}</button>}

                    </td>
                    <td>
                      {!track.isDelivered ? <FaEdit onClick={(e) => editTrack(e, track._id)} className={styles.edit_track} /> : <></>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td>No Tracks</td></tr>
              )}
            </tbody>
          </table>
          {user && user.trackAllowance >= 1 ? <Link id={styles.new_single} to={"/profile/newrelease"}>Create New Single</Link> : <></>}
        </div>

      </div>
    </>
  )
}

export default Singles
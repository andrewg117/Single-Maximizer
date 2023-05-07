import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getTracks, deleteTrack, reset } from '../features/tracks/trackSlice'
import Spinner from '../components/Spinner'
import { FaEdit } from 'react-icons/fa'
import styles from '../css/singles_style.module.css'

function Singles() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { tracks, isLoading } = useSelector((state) => state.tracks)

  useEffect(() => {
    if (!user) {
      navigate('/home')
    } else {
      dispatch(getTracks())
    }

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch])

  const editTrack = (e, id) => {
    e.preventDefault()

    dispatch(deleteTrack(id))
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
                <th>DATE</th>
                <th>STATUS</th>
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody id={styles.singles_content}>
              {tracks.length > 0 ? (tracks.map((track) => (
                <tr key={track._id}>
                  <td>{track.artist}</td>
                  <td>{track.trackTitle}</td>
                  <td>01/01/2001</td>
                  <td><button className={styles.scheduled}>Scheduled</button></td>
                  <td><FaEdit onClick={(e) => editTrack(e, track._id)} className={styles.edit_track}>X</FaEdit></td>
                </tr>
              ))
              ) : (
                <tr><td>You have no tracks</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default Singles
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TrackForm from '../components/TrackForm'
import TrackItem from '../components/TrackItem'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getTracks, reset } from '../features/tracks/trackSlice'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { tracks, isLoading, isError, message } = useSelector((state) => state.tracks)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (!user) {
      navigate('/login')
    } else {
      dispatch(getTracks())
    }

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Track Dashboard</p>
      </section>
      <TrackForm />

      <section className='content'>
        {tracks.length > 0 ? (
          <div className="tracks">
            {tracks.map((track) => ( 
              <TrackItem key={track._id} track={track} />
            ))}
          </div>
        ) : (
          <h3>You have no tracks</h3>
        )}
      </section>
    </>
  )
}

export default Dashboard
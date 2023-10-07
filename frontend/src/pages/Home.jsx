import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { wakeServer } from '../features/auth/authSlice'
import homeImage from '../images/homeImage.png'
import styles from '../css/style.module.css'

// TODO: Make API call to wake up demo server

function Home() {
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(wakeServer()).unwrap()
  //     .catch((error) => console.error(error = 'No Server'))
      
  // }, [dispatch])

  return (
    <>
      <section id={styles.home_block} style={{backgroundImage: `url(${homeImage})`}}>
        {/* <img src={homeImage} alt="Home" id={styles.image} /> */}
        <div id={styles.intro_text}>
          <p>
            GET YOUR
            MUSIC OUT
            TO THE WORLD
          </p>
        </div>
        <div id={styles.intro_btn}>
          <Link to='/home/emailsignup'>
            GET STARTED
          </Link>
        </div>

      </section>
    </>
  )
}

export default Home
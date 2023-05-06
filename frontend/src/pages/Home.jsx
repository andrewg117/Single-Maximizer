import { Link } from 'react-router-dom'
import styles from '../css/style.module.css'

function Home() {
  return (
    <>
      <section id={styles.home_block}>
        <div id={styles.intro_text}>
          <p>
            GET YOUR
            MUSIC OUT
            TO THE WORLD
          </p>
        </div>
        <div id={styles.intro_btn}>
          <Link to='/home/signup'>
            GET STARTED
          </Link>
        </div>

      </section>
    </>
  )
}

export default Home
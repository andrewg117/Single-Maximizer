import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <section id="body-wrapper">
        <section id="home-block">
          <div id="intro-text">
            <p>
              GET YOUR
              MUSIC OUT
              TO THE WORLD
            </p>
          </div>
          <div id="intro-btn">
            <Link to='/home/signup'>
              GET STARTED
            </Link>
          </div>

        </section>
      </section>
    </>
  )
}

export default Home
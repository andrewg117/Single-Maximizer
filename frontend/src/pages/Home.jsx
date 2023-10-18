import { Link } from "react-router-dom";
import homeImage from "../images/homeImage.png";
import styles from "../css/style.module.css";

function Home() {
  return (
    <>
      <section
        id={styles.home_block}
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div id={styles.intro_text}>
          <p>GET YOUR MUSIC OUT TO THE WORLD</p>
        </div>
        <div id={styles.intro_btn}>
          <Link to="/home/emailsignup">GET STARTED</Link>
        </div>
      </section>
    </>
  );
}

export default Home;

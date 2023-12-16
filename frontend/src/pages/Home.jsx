import { Link } from "react-router-dom";
import homeImage from "../images/homeImage.png";
import homeImage2 from "../images/homeImage2.png";
import homeImage3 from "../images/homeImage3.png";
import singlemax from "../images/singlemax.png";
import styles from "../css/home.module.css";
import { FAQDistro, FAQSave } from "./FAQ";

function Home() {
  return (
    <>
      <section
        className={styles.home_block}
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div id={styles.intro_text}>
          <h1>GET YOUR MUSIC OUT TO THE WORLD</h1>
        </div>
        <div id={styles.intro_btn}>
          <Link to="/home/emailsignup">GET STARTED</Link>
        </div>
      </section>

      {/* <section
        id="singleMax-image"
        className={styles.home_block}
        style={{ backgroundImage: `url(${singlemax})` }}
      ></section>

      <section className={styles.home_block}>
        <FAQSave />
      </section>

      <section
        className={styles.home_block}
        style={{ backgroundImage: `url(${homeImage2})` }}
      >
        <div id={styles.intro_text}>
          <h1>GET YOUR MUSIC OUT TO THE WORLD</h1>
        </div>
        <div id={styles.intro_btn}>
          <Link to="/home/emailsignup">GET STARTED</Link>
        </div>
      </section>

      <section className={styles.home_block}>
        <FAQDistro />
      </section>
      
      <section
        className={styles.home_block}
        style={{ backgroundImage: `url(${homeImage3})` }}
      >
        <div id={styles.intro_text}>
          <h1>GET YOUR MUSIC OUT TO THE WORLD</h1>
        </div>
        <div id={styles.intro_btn}>
          <Link to="/home/emailsignup">GET STARTED</Link>
        </div>
      </section> */}
    </>
  );
}

export default Home;

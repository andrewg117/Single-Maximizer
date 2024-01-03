import { Link } from "react-router-dom";
import homeImage from "../images/homeImage.png";
import homeImage2 from "../images/homeImage2.png";
import homeImage3 from "../images/homeImage3.png";
import singlemax from "../images/singlemax.png";
import styles from "../css/home.module.css";
import faq_style from "../css/faq_style.module.css";
import { FAQDistro, FAQSave } from "./FAQ";

function Home() {
  return (
    <>
      <section id={styles.home_body}>
        <section
          className={styles.home_block}
          style={{ backgroundImage: `url(${homeImage})` }}
        >
          <section className={styles.intro_container}>
            <div className={styles.intro_text}>
              <h1>GET YOUR MUSIC OUT TO THE WORLD</h1>
            </div>
            <div className={styles.intro_btn}>
              <Link to="/home/emailsignup">GET STARTED</Link>
            </div>
          </section>
        </section>

        {/* <section
          className={styles.home_block}
          // style={{ backgroundImage: `url(${singlemax})` }}
        >
          <img
            src={singlemax}
            id={styles.singleMax_image}
            alt="singleMax"
          />
        </section> */}

        <section className={styles.home_block}>
          <FAQSave styles={faq_style} />
        </section>

        <section
          className={styles.home_block}
          style={{ backgroundImage: `url(${homeImage2})` }}
        >
          <section className={styles.intro_container_alt}>
            <div className={styles.intro_text_alt}>
              <h1>BECOME AN INSPIRATION</h1>
              <h2>WITH YOUR MUSICAL TALENT</h2>
            </div>
            <div className={`${styles.intro_btn} ${styles.intro_btn_alt}`}>
              <Link to="/home/emailsignup">GET STARTED</Link>
            </div>
          </section>
        </section>

        <section className={styles.home_block}>
          <FAQDistro styles={faq_style} />
        </section>

        <section
          className={styles.home_block}
          style={{ backgroundImage: `url(${homeImage3})` }}
        >
          <section className={styles.intro_container}>
            <div className={styles.intro_text}>
              <h1>GET YOUR MUSIC HEARD</h1>
            </div>
            <div className={styles.intro_btn}>
              <Link to="/home/emailsignup">GET STARTED</Link>
            </div>
          </section>
        </section>

        <section id={styles.hassle_block} className={styles.home_block}>
          <section className={styles.intro_container}>
            <div id={styles.hassle_text}>
              <p>INSPIRE YOUR WORLD WITH YOUR CRAFT</p>
              <p>MAKE YOUR GIFT HEARD</p>
              <h1>WITHOUT THE TIME OR HASSLE</h1>
              <p>SHARE IT WITH US & WE'LL MAKE IT HAPPEN</p>
            </div>
          </section>
        </section>

        <footer>
          
        </footer>
      </section>
    </>
  );
}

export default Home;

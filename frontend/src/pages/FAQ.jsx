import React from "react";
import InspireImage from "../images/INSPIRE-WITH-YOUR-TALENT-150x150.png.webp";
import EliminateImage from "../images/ELIMINATE-THE-HUSSLE-150x150.png.webp";
import ItOnlyImage from "../images/IT-ONLY-TAKES-ONE-150x150.png.webp";
import styles from "../css/faq_style.module.css";

const FaqBlock = ({ src, alt, title, info }) => {
  return (
    <div className={styles.faq_block}>
      <img
        src={src}
        alt={alt}
      />
      <h3>{title}</h3>
      <p>{info}</p>
    </div>
  );
};

function FAQ() {
  return (
    <section id={styles.faq_wrapper}>
      <section id={styles.main_block}>
        <section id={styles.head_grid}>
          <h1>WHAT IS THE SINGLE MAXIMIZER?</h1>
          <h2>HOW DOES IT HELP ME?</h2>
        </section>
        <section id={styles.faq_grid}>
          <FaqBlock
            src={InspireImage}
            alt={"Inspire"}
            title={"Inspire With Your Talent"}
            info={
              "At trackstarz, We believe that you, as an artist, can also make a difference by making your music talent known and heard to inspire the whole world."
            }
          />
          <FaqBlock
            src={EliminateImage}
            alt={"Eliminate"}
            title={"Eliminate the Hustle"}
            info={
              "We know how long it takes to send custom emails to each outlet in the format they request it in. As a music blog ourselves, we know for a fact that sending mass emails to music outlets does not work! And they don’t like when artists don’t follow their submission guidelines."
            }
          />
          <FaqBlock
            src={ItOnlyImage}
            alt={"ItOnly"}
            title={"It Takes Only One"}
            info={
              "You fill out a one-time form, we handle everything else. We will send individual submissions to each outlet in the exact format they request it in. No spam, No mass email blasts. Even better, your music still stays protected!"
            }
          />
        </section>
      </section>
    </section>
  );
}

export default FAQ;

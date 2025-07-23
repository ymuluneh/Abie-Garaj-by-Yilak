import React from "react";
import styles from "./QualitySection.module.css";
import qualityBg from "../../../assets/images/quality.png"; // Background image for the right side

const QualitySection = () => {
  return (
    <section className={styles.qualitySection}>
      <div className={styles.leftContent}>
        <h2 className={styles.heading}>Quality Service And Affordable Price</h2>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum,
          iste? Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <button className={`${styles.discoverMoreBtn} btn`}>
          Discover More
        </button>
      </div>
      <div
        className={styles.rightImage}
        style={{ backgroundImage: `url(${qualityBg})` }}
      >
        {/* The speedometer image or similar is here */}
      </div>
    </section>
  );
};

export default QualitySection;

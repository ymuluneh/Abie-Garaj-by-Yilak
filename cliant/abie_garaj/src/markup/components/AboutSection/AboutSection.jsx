import React from "react";
import styles from "./AboutSection.module.css";
import aboutImage1 from "../../../assets/images/vban1.jpg"; // First image
import aboutImage2 from "../../../assets/images/vban2.jpg"; // Second image

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.imageGrid}>
          <img
            src={aboutImage1}
            alt="Car maintenance"
            className={styles.image1}
          />
          <img src={aboutImage2} alt="Engine parts" className={styles.image2} />
          <div className={styles.experienceBox}>
            <span className={styles.years}>24</span>
            <span className={styles.text}>Years Experience</span>
          </div>
        </div>
        <div className={styles.content}>
          <h2 className={styles.heading}>We have 24 years experience</h2>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam,
            consectetur! Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Laboriosam, consectetur! Lorem ipsum dolor sit amet
            consectetur adipisicing elit.
          </p>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam,
            consectetur! Lorem ipsum dolor sit amet consectetur adipisicing
            elit.
          </p>
          <button className={`${styles.readMoreBtn} btn`}>Read More</button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

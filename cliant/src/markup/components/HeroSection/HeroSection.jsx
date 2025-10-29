import React from "react";
import styles from "./HeroSection.module.css";
import heroBg from "../../../assets/images/banner/banner.jpg"; // Background image

const HeroSection = () => {
  return (
    <section
      className={styles.heroSection}
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Tuneup Your Car to Next Level</h1>
        <button className={`${styles.playBtn}`}>
          {/* You'd use an icon or an SVG here for the play button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

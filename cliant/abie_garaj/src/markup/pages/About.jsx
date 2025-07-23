import React from "react";
import styles from "./About.module.css";
import ctaBg from "../../assets/images/inner.jpg";
import WhyChooseSection from "../components/WhyChooseSection/WhyChooseSection";
import AboutSection from "../components/AboutSection/AboutSection";
import FinalCTA from "../components/FinalCTA/FinalCTA";
import BookNow from "../components/BookNow/BookNow";
import imageRight from "../../assets/images/tool.png"

const About = () => {
  return (
    <>
      <section
        className={styles.finalCtaSection}
        style={{ backgroundImage: `url(${ctaBg})` }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <p className={styles.title}>
            <a href="/">Home</a> About us
          </p>
        </div>
      </section>
      <br />

      <section className={styles.introSection}>
        <div>
          <p>
            <h2>We are highly skilled mechanics for your car repair</h2>
            Bring to the table win-win survival strategies to ensure proactive
            domination. At the end of the day, going forward, a new normal that
            has evolved from generation X is on the runway heading towards a
            streamlined cloud solution.
          </p>
        </div>
        <div>
          {" "}
          <img
            src={imageRight}
            alt="Tire Handling"
            className={styles.imageRight}
          />
        </div>
      </section>
      <AboutSection />
      <WhyChooseSection />
      <FinalCTA />
      <BookNow />
    </>
  );
};

export default About;

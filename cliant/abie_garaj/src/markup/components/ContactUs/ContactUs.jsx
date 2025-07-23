import React from "react";
import styles from "./ContactUs.module.css";
import ctaBg from "../../../assets/images/inner.jpg"; // Background image

const ContactUs = () => {
  return (
    <section
      className={styles.finalCtaSection}
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={styles.title}>contact us</h2>
        <button className={`${styles.contactBtn} btn`}>Contact Now</button>
      </div>
    </section>
  );
};

export default ContactUs;

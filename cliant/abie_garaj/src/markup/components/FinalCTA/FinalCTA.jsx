import React from "react";
import styles from "./FinalCTA.module.css";
import ctaBg from "../../../assets/images/inner.jpg"; 
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section
      className={styles.finalCtaSection}
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={styles.title}>We are leader in Car Mechanical Work</h2>
        <button className={`${styles.contactBtn} btn`}><Link to="/contact">Contact Now</Link></button>
      </div>
    </section>
  );
};

export default FinalCTA;

import React from "react";
import styles from "./BookNow.module.css";
import { FaPhoneAlt } from "react-icons/fa"; // Phone icon

const BookNow = () => {
  return (
    <section className={styles.bookNowSection}>
      <div className={styles.container}>
        <h3 className={styles.text}>Schedule Your Appointment Today</h3>
        <div className={styles.contactInfo}>
          <FaPhoneAlt className={styles.icon} />
          <span className={styles.phoneNumber}>+1800 456 7890</span>
        </div>
        <button className={`${styles.bookNowBtn} btn`}>
          {" "}
          <a href="/admin/order">Book Now</a>
        </button>
      </div>
    </section>
  );
};

export default BookNow;

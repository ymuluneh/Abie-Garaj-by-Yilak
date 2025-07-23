import React from "react";
import styles from "./Contact.module.css";

const Contact = () => {
  return (
    <div className={styles.contactWrapper}>
      <section className={styles.contactContent}>
        <div className={styles.mapContainer}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.001301301688!2d-77.03687068464984!3d38.89767627957021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5d75c4e6f6f8b64f!2sAutoserv!5e0!3m2!1sen!2sus!4v1625153341911!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className={styles.addressSection}>
          <h3>Our Address</h3>
          <p>
            Completely synergize resource taxing relationships via premier niche
            markets. Professionally cultivate one-to-one customer service.
          </p>
          <div className={styles.contactItem}>
            <strong>Address:</strong>
            <span>548, Tailstoi Town 5238 MT, La city, IA 5224</span>
          </div>
          <div className={styles.contactItem}>
            <strong>Email:</strong>
            <span>contact@buildtruck.com</span>
          </div>
          <div className={styles.contactItem}>
            <strong>Phone:</strong>
            <span>1800 456 7890 / 1254 897 3654</span>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h3>Schedule Your Appointment Today</h3>
          <p>Your Automotive Repair & Maintenance Service Specialist</p>
          <span className={styles.ctaPhone}>1800.456.7890</span>
          <button className={styles.ctaButton}>Contact Us</button>
        </div>
      </section>
    </div>
  );
};

export default Contact;

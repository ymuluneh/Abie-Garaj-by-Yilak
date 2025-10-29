import React from "react";
import styles from "./WhyChooseSection.module.css";
import {
  FaCheckCircle,
  FaCarCrash,
  FaUserFriends,
  FaClipboardCheck,
} from "react-icons/fa"; // Example icons
import additionalServiceImage from "../../../assets/images/image.png"; 

const whyChooseItems = [
  {
    icon: <FaCheckCircle />,
    title: "Qualified Team",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: <FaCarCrash />,
    title: "24/7 Car Towing",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: <FaUserFriends />,
    title: "Customer Satisfaction",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    icon: <FaClipboardCheck />,
    title: "Quality Spare Parts",
    description: "Lorem ipsum dolor sit amet consectetur.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className={styles.whyChooseSection}>
      <div className={styles.container}>
        <div className={styles.whyChooseContent}>
          <h2 className={styles.heading}>Why Choose Us</h2>
          <div className={styles.reasonGrid}>
            {whyChooseItems.map((item, index) => (
              <div key={index} className={styles.reasonItem}>
                <div className={styles.iconWrapper}>{item.icon}</div>
                <div>
                  <h3 className={styles.reasonTitle}>{item.title}</h3>
                  <p className={styles.reasonDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.additionalServices}>
          <h2 className={styles.heading}>Additional Services</h2>
          <div className={styles.imageBox}>
            <img
              src={additionalServiceImage}
              alt="Additional Services"
              className={styles.serviceImage}
            />
            <div className={styles.textBox}>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              <ul className={styles.serviceList}>
                <li>
                  <FaCheckCircle className={styles.listIcon} /> Car Washing
                </li>
                <li>
                  <FaCheckCircle className={styles.listIcon} /> Car Polishing
                </li>
                <li>
                  <FaCheckCircle className={styles.listIcon} /> Tire Rotation
                </li>
                <li>
                  <FaCheckCircle className={styles.listIcon} /> AC Repair
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
